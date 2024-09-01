# Bike Rental Service for Tourists or Locals

In Cox's Bazar, a thriving coastal town renowned for its scenic Inani beach, Jhankar Mahbub identified an opportunity to enhance tourism. He established a bike rental service designed to streamline exploration for both tourists and locals. Jhankar implemented an intuitive online booking system that allows users to easily rent bikes, facilitating seamless navigation of Cox's Bazar's diverse landscapes and attractions.

## Technology Stack

### Server

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![mongoose](https://img.shields.io/badge/Mongoose-563D7C?style=for-the-badge&logo=mongoose&logoColor=white)
![Passport Js](https://img.shields.io/badge/PassportJS-114D7C?style=for-the-badge&logo=PassportJS&logoColor=white)

## API Reference

### User Routes

#### Sign Up

- **Method:** `POST`
- **Endpoint:** `/api/auth/signup`

Creates a new user account.

| Parameter  | Type     | Description                                  |
| :--------- | :------- | :------------------------------------------- |
| `name`     | `string` | **Required**. Name of the user.              |
| `email`    | `string` | **Required**. Email address.                 |
| `password` | `string` | **Required**. Password for the user.         |
| `phone`    | `string` | **Required**. Phone number.                  |
| `address`  | `string` | **Required**. Physical address.              |
| `role`     | `string` | **Required**. Role of the user (admin/user). |

#### Login

- **Method:** `POST`
- **Endpoint:** `/api/auth/login`

Authenticates a user and returns a JWT token.

| Parameter  | Type     | Description                  |
| :--------- | :------- | :--------------------------- |
| `email`    | `string` | **Required**. Email address. |
| `password` | `string` | **Required**. Password.      |

#### Get Profile

- **Method:** `GET`
- **Endpoint:** `/api/users/me`

Retrieves the logged-in user's profile.

#### Update Profile

- **Method:** `PUT`
- **Endpoint:** `/api/users/me`

Updates the logged-in user's profile.

| Parameter | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| `name`    | `string` | Optional. Updated name of the user.         |
| `phone`   | `string` | Optional. Updated phone number of the user. |

---

### Bike Routes

#### Create Bike (Admin Only)

- **Method:** `POST`
- **Endpoint:** `/api/bikes`

Creates a new bike entry.

| Parameter      | Type     | Description                            |
| :------------- | :------- | :------------------------------------- |
| `name`         | `string` | **Required**. Name of the bike model.  |
| `description`  | `string` | **Required**. Description of the bike. |
| `pricePerHour` | `number` | **Required**. Rental price per hour.   |
| `cc`           | `number` | Engine capacity in cubic centimeters.  |
| `year`         | `number` | Manufacturing year of the bike.        |
| `model`        | `string` | Model of the bike.                     |
| `brand`        | `string` | Brand of the bike.                     |

#### Get All Bikes

- **Method:** `GET`
- **Endpoint:** `/api/bikes`

Retrieves a list of all available bikes.

#### Update Bike (Admin Only)

- **Method:** `PUT`
- **Endpoint:** `/api/bikes/:id`

Updates an existing bike entry.

| Parameter      | Type     | Description                             |
| :------------- | :------- | :-------------------------------------- |
| `id`           | `string` | **Required**. ID of the bike to update. |
| `pricePerHour` | `number` | Updated rental price per hour.          |

#### Delete Bike (Admin Only)

- **Method:** `DELETE`
- **Endpoint:** `/api/bikes/:id`

Deletes a bike entry.

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. ID of the bike to delete. |

---

### Rental Routes

#### Create Rental

- **Method:** `POST`
- **Endpoint:** `/api/rentals`

Creates a new rental for a specific bike.

| Parameter   | Type     | Description                                                |
| :---------- | :------- | :--------------------------------------------------------- |
| `bikeId`    | `string` | **Required**. ID of the bike to rent.                      |
| `startTime` | `string` | **Required**. Start time of the rental. (Format: ISO 8601) |

#### Return Bike (Admin Only)

- **Method:** `PUT`
- **Endpoint:** `/api/rentals/:id/return`

Marks the return of a rented bike.

| Parameter | Type     | Description                                         |
| :-------- | :------- | :-------------------------------------------------- |
| `id`      | `string` | **Required**. ID of the rental to mark as returned. |

#### Get All Rentals for User

- **Method:** `GET`
- **Endpoint:** `/api/rentals`

Retrieves rental history for the logged-in user.

## Backend Resource

- [Bike-rental-service-Backend](https://github.com/Abir191197/Bike-rental-service-Backend)

## Installation

Install my-project with npm

```bash
 git clone https://github.com/Abir191197/Bike-rental-service-Backend.git
   cd Bike-rental-service-Backend
npm install

PORT=3000

MONGODB_URI=

JWT_SECRET=your_jwt_secret

npm run start:dev
```

## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
