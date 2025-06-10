from flask import Flask, request, jsonify
from ariadne import MutationType, make_executable_schema, graphql_sync, ObjectType
from sqlalchemy import Column, Integer, String, Date, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from flask_cors import CORS
from datetime import datetime

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

    input EventInput {
        nama_event: String!
        deskripsi: String!
        tanggal_mulai: String!
        tanggal_selesai: String!
    }

    type Mutation {
        submitEvent(input: EventInput!): Event!
    }
"""

# Mutation resolvers
mutation = MutationType()

@mutation.field("submitEvent")
def resolve_submit_event(_, info, input):
    session = Session()
    event = Event(
        nama_event=input["nama_event"],
        deskripsi=input["deskripsi"],
        tanggal_mulai=datetime.strptime(input["tanggal_mulai"], "%Y-%m-%d").date(),
        tanggal_selesai=datetime.strptime(input["tanggal_selesai"], "%Y-%m-%d").date(),
        status_approval="pending"
    )
    session.add(event)
    session.commit()
    session.refresh(event)
    session.close()
    return event

# ObjectType for custom mapping
event_obj = ObjectType("Event")

# Schema
schema = make_executable_schema(type_defs, [mutation, event_obj])

# Database connection
engine = create_engine('sqlite:///submit_event.db')
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
    app.run(host='0.0.0.0', port=5004, debug=True) 