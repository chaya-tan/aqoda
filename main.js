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
  }

  get roomNumber() {
    const roomNoLeadingWithZero = "0" + this.nthRoomNoInFloor;
    return this.floor + roomNoLeadingWithZero.slice(-2);
  }

  set GuestDetail(guestDetail) {
    const [name, age] = guestDetail;
    this.guest = { name, age };
  }
  get GuestDetail() {
    return this.guest;
  }

  checkOut() {
    this.guest = {
      name: undefined,
      age: undefined,
    };
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
    this.init = function () {
      for (let floor = 1; floor <= totalFloor; floor++) {
        this.rooms.push([]);
        for (let room = 1; room <= totalRoomPerFloor; room++) {
          this.rooms[floor - 1][room - 1] = new Room(floor, room);
        }
      }
      console.log("rooms", this.rooms);
    };
    this.init();
  }
}

function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);
  let hotelObject;

  commands.forEach((command) => {
    console.log("command", command);
    switch (command.name) {
      case "create_hotel":
        // to do: validate floor, roomPerFloor
        const [floor, roomPerFloor] = command.params;
        const hotel = { floor, roomPerFloor };
        hotelObject = new Hotel(floor, roomPerFloor);

        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        );

        return;
      //to do: book(roomNo, guestName, guestAge)
      //to do: list_available_rooms()
      //to do: checkout()
      //to do: list_guest()
      //to do: get_guest_in_room(roomNo)
      //to do: list_guest_by_age(sign, age)
      //to do: list_guest_by_floor(floor)
      //to do: checkout_guest_by_floor(floor)
      //to do: book_by_floor(floor, guestName, guestAge)
      default:
        return;
    }
  });
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
