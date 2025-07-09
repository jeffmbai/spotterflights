+----------------------+
|     User Opens Web App   |
+----------------------+
            |
            v
+----------------------+
| Search Input Screen  |
| (From, To, Dates)    |
+----------------------+
            |
            v
+-----------------------------+
| Call Sky Scrapper API       |
| Endpoint: /flights/search   |
| Params: origin, destination|
|          date, passengers  |
+-----------------------------+
            |
            v
+-----------------------------+
| Receive API Response        |
| (Available Flights, etc.)   |
+-----------------------------+
            |
            v
+-----------------------------+
| Display Results Grid/List   |
| Sort/Filter Options         |
| - Price, Duration, Airline  |
+-----------------------------+
            |
            v
+-----------------------------+
| User Clicks a Flight Card   |
| -> Show flight details      |
+-----------------------------+
            |
            v
+-----------------------------+
| Responsive Design Flow      |
| Mobile <-> Tablet <-> Web   |
| (React + Tailwind/CSS Grid)|
+-----------------------------+
            |
            v
+-----------------------------+
| Optional: Add Booking CTA   |
| Redirect to Airline/Site    |
+-----------------------------+
