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
        allEvents: [Event!]!
    }
"""

# Query resolvers
query = QueryType()

@query.field("allEvents")
def resolve_all_events(_, info):
    session = Session()
    events = session.query(Event).all()
    # Get all approval logs
    approval_logs = session.query(EventApprovalLog)\
        .order_by(EventApprovalLog.tanggal_approval.desc())\
        .all()
    # Create a dictionary of latest approval logs by event_id
    latest_logs = {}
    for log in approval_logs:
        if log.event_id not in latest_logs:
            latest_logs[log.event_id] = log
    # Add catatan to each event
    for event in events:
        if event.event_id in latest_logs:
            event.catatan = latest_logs[event.event_id].catatan
    session.close()
    return events

# ObjectType for custom mapping
event_obj = ObjectType("Event")

# Schema
schema = make_executable_schema(type_defs, [query, event_obj])

# Database connection
engine = create_engine('sqlite:///all_events.db')
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
    app.run(host='0.0.0.0', port=5003, debug=True) 