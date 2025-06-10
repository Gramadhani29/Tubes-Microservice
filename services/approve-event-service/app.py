from flask import Flask, request, jsonify
from ariadne import MutationType, make_executable_schema, graphql_sync, ObjectType
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
    }

    input ApprovalInput {
        event_id: Int!
        status_approval: String!
        catatan: String
    }

    type Mutation {
        approveEvent(input: ApprovalInput!): Event!
    }
"""

# Mutation resolvers
mutation = MutationType()

@mutation.field("approveEvent")
def resolve_approve_event(_, info, input):
    session = Session()
    event = session.query(Event).filter_by(event_id=input["event_id"]).first()
    if not event:
        session.close()
        raise Exception("Event not found")
    event.status_approval = input["status_approval"]
    approval_log = EventApprovalLog(
        event_id=input["event_id"],
        tanggal_approval=date.today(),
        status=input["status_approval"],
        catatan=input.get("catatan")
    )
    session.add(approval_log)
    session.commit()
    session.refresh(event)
    session.close()
    return event

# ObjectType for custom mapping
event_obj = ObjectType("Event")

# Schema
schema = make_executable_schema(type_defs, [mutation, event_obj])

# Database connection
engine = create_engine('sqlite:///approve_event.db')
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
    app.run(host='0.0.0.0', port=5005, debug=True) 