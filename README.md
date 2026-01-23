# Marlboro High School Parking Spot Selection System

A fully functional parking spot selection website for rising seniors at Marlboro High School. Students can select a parking spot visually, fill out a form, and receive confirmation. Admins can log in and view/reset parking data.

## Project Structure

```
ParkingSpotMHS/
├── index.html                    # Homepage
├── parking.html                  # Parking selection page
├── form.html                     # Student information form
├── confirmation.html             # Confirmation page
├── admin.html                    # Admin dashboard
├── public/
│   ├── css/
│   │   ├── style.css            # Global styles (light/dark mode, layout)
│   │   ├── parking.css          # Parking lot specific styles
│   │   └── admin.css            # Admin dashboard styles
│   ├── js/
│   │   ├── app.js               # Global app logic (navbar, utilities)
│   │   ├── parking.js           # Parking page logic
│   │   ├── form.js              # Form page logic
│   │   ├── confirmation.js      # Confirmation page logic
│   │   └── admin.js             # Admin page logic
│   ├── data/
│   │   └── parkingData.json     # Parking spots data
│   └── components/
│       └── navbar.html          # Navbar component
└── README.md                     # This file
```

## Technology Stack

- **Frontend Framework:** Vue 3 (CDN)
- **CSS Framework:** Bootstrap 5
- **Storage:** LocalStorage (client-side persistence)
- **Data Format:** JSON
- **Languages:** HTML, CSS, JavaScript

## Features

### Student Features
- ✅ Visual parking lot grid with interactive spots
- ✅ Two-part parking spots (shareable between students)
- ✅ Available/taken spot color coding
- ✅ Spot selection persistence in browser
- ✅ Student information form with validation
- ✅ Partner information capture
- ✅ Confirmation summary display
- ✅ Light/Dark mode toggle
- ✅ Responsive mobile design

### Admin Features
- ✅ Password-protected login
- ✅ Dashboard with parking statistics
- ✅ Table view of all student submissions
- ✅ Search/filter functionality
- ✅ Remove/reset individual spots
- ✅ Reset all parking data
- ✅ Export data functionality
- ✅ Copy-to-clipboard actions
- ✅ Session management with logout

## Pages

### 1. **index.html** - Homepage
- Overview of the senior parking program
- Rules and guidelines
- Explanation of shared spots
- Timeline of the process
- Quick start button to parking selection

### 2. **parking.html** - Parking Selection
- Interactive parking lot grid
- Lot selector buttons (A, B, C)
- Dynamic spot availability display
- Visual feedback on selection
- Continue to form button

### 3. **form.html** - Student Information Form
- Student name input
- Student ID input
- Email address input
- Partner name input
- Partner ID input
- Selected spot summary
- Form validation
- Submit button

### 4. **confirmation.html** - Confirmation Page
- Assignment confirmation alert
- Assigned lot and spot display
- Student information summary
- Partner information summary
- Next steps instructions
- Important notes
- Print confirmation button

### 5. **admin.html** - Admin Dashboard
- Login screen with password authentication
- Dashboard with statistics:
  - Total spots
  - Reserved spots
  - Available spots
  - Occupancy rate
- Admin controls:
  - Reset all parking data
  - Export data
- Student data table with search
- Action buttons per row:
  - Copy data
  - Remove spot
- Logout functionality

## Color Scheme

### Light Mode (Default)
- Primary: #2c3e50 (Dark Blue-Gray)
- Secondary: #3498db (Bright Blue)
- Success: #27ae60 (Green)
- Danger: #e74c3c (Red)
- Background: #ecf0f1 (Light Gray)
- Card Background: #ffffff (White)

### Dark Mode
- Primary: #ecf0f1 (Light Gray)
- Secondary: #3498db (Bright Blue)
- Success: #2ecc71 (Bright Green)
- Danger: #e74c3c (Red)
- Background: #1e1e1e (Dark Gray)
- Card Background: #2c3e50 (Blue-Gray)

## Data Structure

### Parking Data (`parkingData.json`)
```json
{
  "parkingLots": {
    "A": {
      "name": "Lot A",
      "totalSpots": 24,
      "spots": [
        {
          "id": "A-1",
          "lot": "A",
          "number": 1,
          "taken": false,
          "student": null,
          "partner": null,
          "email": null,
          "reservedDate": null
        }
      ]
    }
  },
  "adminPassword": "admin123",
  "lastUpdated": "2024-01-23T00:00:00Z"
}
```

### Student Submission (LocalStorage)
```json
{
  "selectedSpot": {
    "lot": "A",
    "number": 1
  },
  "student": {
    "fullName": "John Doe",
    "studentId": "123456",
    "email": "student@school.edu"
  },
  "partner": {
    "fullName": "Jane Doe",
    "studentId": "654321"
  },
  "submissionDate": "2024-01-23T10:30:00Z"
}
```

## LocalStorage Keys

- `selectedParking` - Currently selected parking spot
- `studentSubmission` - Complete student form submission
- `theme` - Light/Dark mode preference (light/dark)
- `adminSession` - Admin authentication session

## Admin Password

Default admin password: `admin123`

**Note:** Password is stored in `parkingData.json` but should be changed before production use.

## Installation & Usage

1. **Download/Clone the project**
   - Ensure all files are in the same directory

2. **Open in browser**
   - Open `index.html` in a web browser
   - No server or build process required
   - Everything runs client-side

3. **Access parking selection**
   - Click "Select Spot Now" on homepage
   - Choose available spot (green)
   - Fill out the form
   - View confirmation

4. **Access admin dashboard**
   - Click "Admin Dashboard" on navbar
   - Enter password: `admin123`
   - View all submissions and manage spots

## Commit Phases

This project follows a phased commit approach:

1. **COMMIT 1** - Project structure and base setup
2. **COMMIT 2** - Light/Dark mode system
3. **COMMIT 3** - Homepage content
4. **COMMIT 4** - Parking lot UI design
5. **COMMIT 5** - Parking lot data system
6. **COMMIT 6** - Student form system
7. **COMMIT 7** - Confirmation page
8. **COMMIT 8** - Admin auth system
9. **COMMIT 9** - Admin dashboard
10. **COMMIT 10** - Final testing & polish

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires JavaScript enabled and localStorage support.

## Future Enhancements

- Backend integration with database
- Email notifications
- PDF export
- Advanced scheduling system
- Vehicle registration
- Mobile app
- Print-friendly reports
- Backup/restore functionality

## License

© 2024-2025 Marlboro High School. All rights reserved.

---

**Last Updated:** January 23, 2025
**Project Status:** Phase 1 Complete (Base Setup)
