class Hotel {
  constructor(totalFloor, totalRoomPerFloor) {
    this.totalFloor = totalFloor;
    this.totalRoomPerFloor = totalRoomPerFloor;
    this.rooms = [];
    this.keycards = [];
    this.init = function () {
      for (let floor = 1; floor <= totalFloor; floor++) {
        this.rooms.push([]);
        for (let room = 1; room <= totalRoomPerFloor; room++) {
          this.rooms[floor - 1][room - 1] = new Room(floor, room);
        }
      }

      const totalRooms = this.totalFloor * this.totalRoomPerFloor;
      for (let keycardNo = 1; keycardNo <= totalRooms; keycardNo++) {
        this.keycards.push({ keycardNo, roomNo: undefined });
      }
    };
    this.init();
  }

  getKeyCardNoAndBookKeycardForRoom(roomNo) {
    for (let keycard of this.keycards) {
      if (!keycard.roomNo) {
        keycard.roomNo = roomNo;
        return keycard.keycardNo;
      }
    }
  }

  bookByFloor(floorToBook, guestNameToBook, guestAgeToBook) {
    const allRoomsInTheFloor = this.rooms[floorToBook - 1];
    let isTheFloorEmpty = true;
    allRoomsInTheFloor.map((room) => {
      if (room.guest.name) isTheFloorEmpty = false;
    });
    if (isTheFloorEmpty) {
      let bookedRoomNumbers = [];
      let bookedKeycardNumbers = [];
      allRoomsInTheFloor.map((room) => {
        const nthRoom = room.nthRoomNoInFloor;
        const keycardNo = this.bookAndReturnKeycardNo(
          floorToBook,
          nthRoom,
          guestNameToBook,
          guestAgeToBook
        );

        bookedRoomNumbers.push(
          this.getRoomNoFromFloorAndNth(floorToBook, nthRoom)
        );
        bookedKeycardNumbers.push(keycardNo);
      });
      console.log(
        `Room ${bookedRoomNumbers.join(
          ", "
        )} are booked with keycard number ${bookedKeycardNumbers.join(", ")}`
      );
    } else {
      console.log(`Cannot book floor ${floorToBook} for ${guestNameToBook}.`);
    }
  }

  bookAndLog(roomNo, guestName, guestAge) {
    const floorNo = this.getFloorFromRoomNo(roomNo);
    const roomNth = this.getRoomNthFromRoomNo(roomNo);

    const theRoomToBook = this.rooms[floorNo - 1][roomNth - 1];

    if (theRoomToBook.guest.name) {
      console.log(
        `Cannot book room ${roomNo} for ${guestName}, The room is currently booked by ${theRoomToBook.guest.name}.`
      );
    } else {
      const keycardNo = this.bookAndReturnKeycardNo(
        floorNo,
        roomNth,
        guestName,
        guestAge
      );
      console.log(
        `Room ${roomNo} is booked by ${guestName} with keycard number ${keycardNo}.`
      );
    }
  }

  bookAndReturnKeycardNo(floorNo, roomNth, guestName, guestAge) {
    const roomNo = this.getRoomNoFromFloorAndNth(floorNo, roomNth);
    const keycardNo = this.getKeyCardNoAndBookKeycardForRoom(roomNo);
    this.rooms[floorNo - 1][roomNth - 1].checkIn({
      guestName,
      guestAge,
      keycardNo,
    });
    return keycardNo;
  }

  listGuestNames() {
    const guests = this.getGuests();
    const guestNames = guests.map((guest) => guest.name);
    console.log(guestNames.join(", "));
  }

  getGuests() {
    let guests = [];
    this.rooms.map((floor) => {
      floor.map((room) => {
        if (room.guest.name && !guests.includes(room.guest.name)) {
          guests.push({ name: room.guest.name, age: room.guest.age });
        }
      });
    });
    return guests;
  }

  checkOutWithKeycardNo(keycardNo, guestName) {
    let roomNoBookedWithTheKeycard = this.keycards[keycardNo - 1].roomNo;
    roomNoBookedWithTheKeycard += "";
    const floorBooked = parseInt(roomNoBookedWithTheKeycard.substring(0, 1));
    const nthRoomBooked = parseInt(roomNoBookedWithTheKeycard.substring(1));

    const bookedName = this.rooms[floorBooked - 1][nthRoomBooked - 1].guest
      .name;

    if (bookedName === guestName) {
      this.checkOut(floorBooked, nthRoomBooked, keycardNo);
      // hotelInstance.rooms[floorBooked - 1][nthRoomBooked - 1].checkOut();
      // hotelInstance.keycards[keycardNo - 1].roomNo = undefined;
      console.log(`Room ${roomNoBookedWithTheKeycard} is checkout.`);
    } else {
      console.log(
        `Only ${bookedName} can checkout with keycard number ${keycardNo}.`
      );
    }
  }

  checkOut(floor, nthRoom, keycardNo) {
    this.rooms[floor - 1][nthRoom - 1].checkOut();
    this.keycards[keycardNo - 1].roomNo = undefined;
  }

  getFloorFromRoomNo(roomNo) {
    roomNo += "";
    return parseInt(roomNo.substring(0, 1));
  }

  getRoomNthFromRoomNo(roomNo) {
    roomNo += "";
    return parseInt(roomNo.substring(1));
  }

  getRoomNoFromFloorAndNth(floor, nthroom) {
    const roomNoLeadingWithZero = "0" + nthroom;
    return floor + roomNoLeadingWithZero.slice(-2);
  }
}

class Room {
  constructor(floor, nthRoomNoInFloor) {
    this.floor = floor;
    this.nthRoomNoInFloor = nthRoomNoInFloor;
    this.guest = {
      name: undefined,
      age: undefined,
    };
    this.keycardNo = undefined;
  }

  get roomNumber() {
    const roomNoLeadingWithZero = "0" + this.nthRoomNoInFloor;
    return this.floor + roomNoLeadingWithZero.slice(-2);
    // return getRoomNoFromFloorAndNth(this.floor, this.nthRoomNoInFloor);
  }

  get GuestDetail() {
    return this.guest;
  }

  checkIn(guestDetail) {
    const { guestName, guestAge, keycardNo } = guestDetail;
    this.guest = { name: guestName, age: guestAge };
    this.keycardNo = keycardNo;
  }

  checkOut() {
    this.guest = {
      name: undefined,
      age: undefined,
    };
    this.keycardNo = undefined;
  }

  isAvailable() {
    return !!guest.name;
  }
}

module.exports = {
  Hotel,
  Room,
};
