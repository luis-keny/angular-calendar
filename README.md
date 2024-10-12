# Angular Calendar

**Angular Calendar** is a calendar component inspired by Google Calendar, designed to be highly customizable and adaptable for any developer wanting to work with calendars in Angular. The project is built using Angular 18 without any additional libraries, ensuring a lightweight and efficient experience.

## Description

The purpose of this project is to create a versatile calendar that allows users to register events and view them across different views, such as:

- Daily view
- Weekly view
- Monthly view
- Yearly view

The calendar component is **responsive by default**, adapting to different screen sizes to provide a seamless user experience on any device.

## Features

- **Event registration**: Allows users to add, edit, and delete events in the calendar.
- **Multiple views**: Offers day, week, month, and year views to provide a flexible overview of scheduled events.
- **Customization**: The component is easily customizable to meet the requirements of other developers.
- **Responsive design**: Adapts to mobile and desktop screens for an optimal user experience.
- **Clean architecture**: Follows a folder structure based on `core`, `feature`, `layout`, and `shared` principles.

## Technologies

- **Angular 18**: The main framework used in this project.
- **Onest**: The font used in the design of the calendar.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/angular-calendar.git
    ```

2. Navigate to the project directory:
    ```bash
    cd angular-calendar
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Start the development server:
    ```bash
    ng serve
    ```
5. Open the application in your browser:
    ```bash
    http://localhost:4200
    ```
## Usage

Once the project is up and running, you can interact with the calendar, add events, and switch between different views (day, week, month, year) according to your needs.

## Project Structure

The project follows a **clean architecture** to ensure maintainability and scalability. The folder structure is divided into the following key areas:

- `core`: Central code managing shared logic.
- `feature`: Main calendar functionalities.
- `layout`: Manages the visual structure and design of the application.
- `shared`: Reusable components, styles and services throughout the application.