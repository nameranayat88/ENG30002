# Smart Parking & EV Charging System

This repository hosts the **Smart Parking & EV Charging System** application, a web-based platform that integrates real-time parking management and electric vehicle (EV) charging. The application enables users to monitor parking spot availability, start and stop EV charging sessions, and access detailed cost tracking. Designed for scalability and ease of use, the platform leverages cloud infrastructure and real-time communication protocols to ensure a seamless experience for both desktop and mobile users.


## Key Features

- **Real-time Parking Spot Monitoring**: View live updates on parking availability across multiple locations.
- **EV Charging Management**: Initiate, monitor, and complete EV charging sessions, including real-time cost calculation based on usage.
- **Google Maps Integration**: Interactive map using Google Maps to display parking spots with geographical accuracy.
- **Energy Source Filtering**: Filter parking spots based on energy sources (e.g., Solar, Natural Grid) to encourage eco-friendly choices.
- **Mobile Responsiveness**: Fully responsive design ensuring compatibility across devices.
- **Real-time Data Updates**: Low-latency updates on parking statuses and charging activities using MQTT protocols.


## Installation and Setup

To set up the project locally, follow the steps below:

### Prerequisites

Make sure you have **Node.js** installed on your machine.

### Installing Dependencies

To install all required dependencies, run the following command:

`npm install`

### Running in Development Mode
To start the development server with hot-reload, use:

`npm run serve`

### Building for Production
To compile and minify the project for production, run:

`npm run build`

### Linting and Code Fixes
To run linting and automatically fix code style issues, use:

`npm run lint`

---


### Configuration Customization

To customize the configuration, refer to the [Vue CLI Configuration Documentation](https://cli.vuejs.org/config/)

 To customize the MQTT settings, refer to the [MQTT Configuration Documentation](https://www.hivemq.com/blog/mqtt-client-library-mqtt-js/)


### Technology Stack
---

The platform is built using modern technologies for performance and scalability:

- Frontend: Built with Vue.js, leveraging its component-based architecture for a modular and maintainable structure.
- Real-time Communication: Uses MQTT (via mqtt.js) to ensure real-time updates for parking status and EV charging activities.
- Maps and Geolocation: Integrated with the Google Maps API to dynamically display parking spots.
- Cloud Hosting: Hosted on Firebase, ensuring reliable and scalable cloud infrastructure.

### Live Application
---

The live version of the application is available here: [Smart Parking & EV Charging System](https://smart-parking-app-e0a65.web.app/)


### Project Team
---

This project is developed by a team of software engineering students:

- [Dewan Md Amir Jahir](https://github.com/AmirAX17)
- [Namera Nayat](https://github.com/nameranayat88)
- [Tafriha Tahsin](https://github.com/Tafriha)
- [Abrar Taslim](https://github.com/Abrar914)
- [Mohammad Imamul Hossain](https://github.com/Mursalin1075)
