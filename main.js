const fs = require("fs");
const { isRegExp } = require("util");
const { Hotel, Room } = require("./hotel.js");

let hotelInstance;

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);

  commands.forEach((command) => {
    switch (command.name) {
      case "create_hotel":
        // to do: validate floor, roomPerFloor
        const [floor, roomPerFloor] = command.params;
        hotelInstance = new Hotel(floor, roomPerFloor);
        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        );

        return;
      case "book":
        // to do: validate
        let [bookRoomNo, bookGuestName, bookGuestAge] = command.params;
        hotelInstance.bookAndLog(bookRoomNo, bookGuestName, bookGuestAge);
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
      case "checkout":
        let [checkOutkeycardNo, checkOutguestName] = command.params;
        hotelInstance.checkOutWithKeycardNo(
          checkOutkeycardNo,
          checkOutguestName
        );
        return;
      case "list_guest":
        hotelInstance.listGuestNames();
        return;
      case "get_guest_in_room":
        let [guestRoomNo] = command.params;
        console.log(
          hotelInstance.rooms[
            hotelInstance.getFloorFromRoomNo(guestRoomNo) - 1
          ][hotelInstance.getRoomNthFromRoomNo(guestRoomNo) - 1].guest.name
        );
        return;
      case "list_guest_by_age":
        let [listGuestSign, listGuestAge] = command.params;
        const allGuests = hotelInstance.getGuests();
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
      case "checkout_guest_by_floor":
        const [floorToCheckout] = command.params;
        const roomsInTheFloorToCheckout =
          hotelInstance.rooms[floorToCheckout - 1];
        let roomsCheckedOut = [];

        roomsInTheFloorToCheckout.map((room) => {
          if (room.guest.name) {
            hotelInstance.checkOut(
              room.floor,
              room.nthRoomNoInFloor,
              room.keycardNo
            );
            roomsCheckedOut.push(room.roomNumber);
          }
        });
        console.log(`Room ${roomsCheckedOut.join(", ")} are checkout.`);
        return;
      case "book_by_floor":
        const [floorToBook, guestNameToBook, guestAgeToBook] = command.params;
        hotelInstance.bookByFloor(floorToBook, guestNameToBook, guestAgeToBook);
        return;
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
