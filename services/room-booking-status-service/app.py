from flask import Flask, request, jsonify
from ariadne import QueryType, make_executable_schema, graphql_sync, ObjectType
from sqlalchemy import Column, Integer, String, Date, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from flask_cors import CORS
from datetime import date

# Database setup
Base = declarative_base()

class RoomBookingStatus(Base):
    __tablename__ = 'room_booking_status'
    booking_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('event.event_id'))
    room_id = Column(Integer)
    status_booking = Column(String(255))
    tanggal_update = Column(Date)
    event = relationship("Event", back_populates="room_bookings")

class Event(Base):
    __tablename__ = 'event'
    event_id = Column(Integer, primary_key=True)
    nama_event = Column(String(255))
    room_bookings = relationship("RoomBookingStatus", back_populates="event")

# GraphQL Schema
type_defs = """
    type RoomBookingStatus {
        booking_id: Int!
        event_id: Int!
        room_id: Int!
        status_booking: String!
        tanggal_update: String!
        event: Event
    }

    type Event {
        event_id: Int!
        nama_event: String!
    }

    type Query {
        roomBookingStatus(booking_id: Int!): RoomBookingStatus
    }
"""

# Query resolvers
query = QueryType()

@query.field("roomBookingStatus")
def resolve_room_booking_status(_, info, booking_id):
    session = Session()
    result = session.query(RoomBookingStatus).filter_by(booking_id=booking_id).first()
    session.close()
    return result

# ObjectType for custom mapping
room_booking_status_obj = ObjectType("RoomBookingStatus")
event_obj = ObjectType("Event")

# Schema
schema = make_executable_schema(type_defs, [query, room_booking_status_obj, event_obj])

# Database connection
engine = create_engine('sqlite:///room_booking.db')
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
    app.run(host='0.0.0.0', port=5002, debug=True) 