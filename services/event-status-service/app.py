from flask import Flask, request, jsonify
from ariadne import QueryType, make_executable_schema, graphql_sync, ObjectType
from sqlalchemy import Column, Integer, String, Date, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from flask_cors import CORS
from datetime import date

# Database setup
Base = declarative_base()

class Event(Base):
    __tablename__ = 'event'
    event_id = Column(Integer, primary_key=True)
    nama_event = Column(String(255))
    deskripsi = Column(String(1000))
    tanggal_mulai = Column(Date)
    tanggal_selesai = Column(Date)
    status_approval = Column(String(255))
    approval_logs = relationship("EventApprovalLog", back_populates="event")

class EventApprovalLog(Base):
    __tablename__ = 'event_approval_log'
    approval_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('event.event_id'))
    tanggal_approval = Column(Date)
    status = Column(String(255))
    catatan = Column(String(1000))
    event = relationship("Event", back_populates="approval_logs")

# GraphQL Schema
type_defs = """
    type Event {
        event_id: Int!
        nama_event: String!
        deskripsi: String!
        tanggal_mulai: String!
        tanggal_selesai: String!
        status_approval: String!
        catatan: String
    }

    type Query {
        eventStatus(event_id: Int!): Event
    }
"""

# Query resolvers
query = QueryType()

@query.field("eventStatus")
def resolve_event_status(_, info, event_id):
    session = Session()
    event = session.query(Event).filter_by(event_id=event_id).first()
    if event:
        # Get the latest approval log for this event
        approval_log = session.query(EventApprovalLog)\
            .filter_by(event_id=event_id)\
            .order_by(EventApprovalLog.tanggal_approval.desc())\
            .first()
        if approval_log:
            # Add catatan to event object
            event.catatan = approval_log.catatan
    session.close()
    return event

# ObjectType for custom mapping
event_obj = ObjectType("Event")

# Schema
schema = make_executable_schema(type_defs, [query, event_obj])

# Database connection
engine = create_engine('sqlite:///event_status.db')
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

# Flask app
app = Flask(__name__)
CORS(app)

@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=True
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)