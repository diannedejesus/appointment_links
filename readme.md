# Booking Office Meetings

**Built by Dianne De Jesus**

## Description

This application will permit the user to create a custom link with available dates for a client to select (only a single date can be chosen). Once the client selects a date, it will be added to the user's calendar. The user will be notified which date was selected by email and the client will recieve a confirmation email.

### User Interfase Description

The user will be able to create date/time slots for a client to select. They will include the clients information and other details pertinate to the appointment. A link will be generated and sent to the client by email.

### Client Interfase Description

The client will see the times/dates available for the specified appointment and the details for the appointment. When a date is selected they will need to confirm the selection. Once the selection is confirmed the user will recieve an email and the date will be added to the user's calendar. The client will also recieve an email.

## Goals and milestones

- Get the connection between the exchange server and nodejs established.
- Get a basic MVC nodejs working for the user and client interfase.
- Design the data schemas needed
- Determine the login format for the app.
- Verify authentication process for exchange servers
- Get email and calendar interation with app.
- [Feature] Verify that date/times don't overlap
- [Feature] Calendar display
- [Wishlist] Verify holidays and vacation days
- [Wishlist] limit access to link by email
