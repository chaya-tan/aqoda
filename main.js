const fs = require("fs");
const { isRegExp } = require("util");

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
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
}

let hotelInstance;

function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);

  commands.forEach((command) => {
    // console.log("command", command);
    switch (command.name) {
      case "create_hotel":
        // to do: validate floor, roomPerFloor
        const [floor, roomPerFloor] = command.params;
        // const hotel = { floor, roomPerFloor };
        hotelInstance = new Hotel(floor, roomPerFloor);
        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        );

        return;
      case "book":
        // to do: validate
        let [bookRoomNo, bookGuestName, bookGuestAge] = command.params;
        book(bookRoomNo, bookGuestName, bookGuestAge);
        return;

      case "list_available_rooms":
        let availableRooms = [];
        hotelInstance.rooms.map((floor) => {
          floor.map((room) => {
            if (!room.guest.name) {
              availableRooms.push(room.roomNumber);
            }
          });
        });
        console.log(availableRooms.join(", "));
        return;
      //to do: checkout(keycardNo, guestName)
      case "checkout":
        let [checkOutkeycardNo, checkOutguestName] = command.params;
        checkOutWithKeycardNo(checkOutkeycardNo, checkOutguestName);
        return;
      //to do: list_guest()
      case "list_guest":
        listGuestNames();
        return;
      //to do: get_guest_in_room(roomNo)
      case "get_guest_in_room":
        let [guestRoomNo] = command.params;
        console.log(
          hotelInstance.rooms[getFloorFromRoomNo(guestRoomNo) - 1][
            getRoomNthFromRoomNo(guestRoomNo) - 1
          ].guest.name
        );
        return;
      //to do: list_guest_by_age(sign, age)
      case "list_guest_by_age":
        let [listGuestSign, listGuestAge] = command.params;
        const allGuests = getGuests();
        let filteredGuests, filteredGuestNames;
        switch (listGuestSign) {
          case "<":
            filteredGuests = allGuests.filter(
              (guest) => guest.age < listGuestAge
            );
            filteredGuestNames = filteredGuests.map((guest) => guest.name);
            console.log(filteredGuestNames.join(", "));
            return;
          case ">":
            filteredGuests = allGuests.filter(
              (guest) => guest.age > listGuestAge
            );
            filteredGuestNames = filteredGuests.map((guest) => guest.name);
            console.log(filteredGuestNames.join(", "));
            return;
          default:
            console.log("please specify < or > to filter guests by age");
            return;
        }
      //to do: list_guest_by_floor(floor)
      case "list_guest_by_floor":
        const [floorToListGuest] = command.params;
        const roomsInTheFloor = hotelInstance.rooms[floorToListGuest - 1];
        let guests = [];

        roomsInTheFloor.map((roomInTheFloor) => {
          if (
            roomInTheFloor.guest.name &&
            !guests.includes(roomInTheFloor.guest.name)
          ) {
            guests.push(roomInTheFloor.guest.name);
          }
        });
        console.log(guests.join(", "));

        return;
      //to do: checkout_guest_by_floor(floor)
      case "checkout_guest_by_floor":
        const [floorToCheckout] = command.params;
        const roomsInTheFloorToCheckout =
          hotelInstance.rooms[floorToCheckout - 1];
        let roomsCheckedOut = [];

        roomsInTheFloorToCheckout.map((room) => {
          if (room.guest.name) {
            checkOut(room.floor, room.nthRoomNoInFloor, room.keycardNo);
            roomsCheckedOut.push(room.roomNumber);
          }
        });
        console.log(`Room ${roomsCheckedOut.join(", ")} are checkout.`);
        return;
      //to do: book_by_floor(floor, guestName, guestAge)
      case "book_by_floor":
        return;
      default:
        return;
    }
  });
}

function listGuestNames() {
  const guests = getGuests();
  const guestNames = guests.map((guest) => guest.name);
  console.log(guestNames.join(", "));
}

function getGuests() {
  let guests = [];
  hotelInstance.rooms.map((floor) => {
    floor.map((room) => {
      if (room.guest.name && !guests.includes(room.guest.name)) {
        guests.push({ name: room.guest.name, age: room.guest.age });
      }
    });
  });
  return guests;
}

function getFloorFromRoomNo(roomNo) {
  roomNo += "";
  return parseInt(roomNo.substring(0, 1));
}

function getRoomNthFromRoomNo(roomNo) {
  roomNo += "";
  return parseInt(roomNo.substring(1));
}

function book(roomNo, guestName, guestAge) {
  const floorNo = getFloorFromRoomNo(roomNo);
  const roomNth = getRoomNthFromRoomNo(roomNo);

  const theRoomToBook = hotelInstance.rooms[floorNo - 1][roomNth - 1];

  if (theRoomToBook.guest.name) {
    console.log(
      `Cannot book room ${roomNo} for ${guestName}, The room is currently booked by ${theRoomToBook.guest.name}.`
    );
  } else {
    const keycardNo = hotelInstance.getKeyCardNoAndBookKeycardForRoom(roomNo);
    hotelInstance.rooms[floorNo - 1][roomNth - 1].checkIn({
      guestName,
      guestAge,
      keycardNo,
    });
    console.log(
      `Room ${roomNo} is booked by ${guestName} with keycard number ${keycardNo}.`
    );
  }
}

function checkOutWithKeycardNo(keycardNo, guestName) {
  let roomNoBookedWithTheKeycard = hotelInstance.keycards[keycardNo - 1].roomNo;
  roomNoBookedWithTheKeycard += "";
  const floorBooked = parseInt(roomNoBookedWithTheKeycard.substring(0, 1));
  const nthRoomBooked = parseInt(roomNoBookedWithTheKeycard.substring(1));

  const bookedName =
    hotelInstance.rooms[floorBooked - 1][nthRoomBooked - 1].guest.name;

  if (bookedName === guestName) {
    checkOut(floorBooked, nthRoomBooked, keycardNo);
    // hotelInstance.rooms[floorBooked - 1][nthRoomBooked - 1].checkOut();
    // hotelInstance.keycards[keycardNo - 1].roomNo = undefined;
    console.log(`Room ${roomNoBookedWithTheKeycard} is checkout.`);
  } else {
    console.log(
      `Only ${bookedName} can checkout with keycard number ${keycardNo}.`
    );
  }
}

function checkOut(floor, nthRoom, keycardNo) {
  hotelInstance.rooms[floor - 1][nthRoom - 1].checkOut();
  hotelInstance.keycards[keycardNo - 1].roomNo = undefined;
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8");
  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10);
            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );
}

main();
