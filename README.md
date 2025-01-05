# LangFlow Based Social Media Engagement Analysis Web App!

## [CLICK HERE TO ACCESS LIVE PROJECT !!!](https://teamfullstackforce.onrender.com/)

This project is a React-based web application that fetches engagement metrics and insights for various types of social media posts from a backend server(LangFlow API with Astra DB). The application displays the data visually using a bar chart and provides actionable insights in a user-friendly Markdown format.

## Features

- **Bar Chart Visualization**:

  - Displays average likes, shares, and comments for different post types.
  - Powered by `react-chartjs-2` and `chart.js`.
- **Markdown Insights Rendering**:

  - Displays detailed insights in a readable and interactive Markdown format.
  - Supports emojis, bullet points, and headings using `react-markdown`.
- **Responsive Design**:

  - Chart and content adapt to different screen sizes for optimal viewing.

## Installation

Follow these steps to set up the project:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm run dev
   ```

## Dependencies

- `axios`: For making HTTP requests to the backend server.
- `react-chartjs-2` and `chart.js`: For creating bar charts.

Install them using:

```bash
npm install axios react-chartjs-2 chart.js react-markdown
```

## Backend Integration

The app fetches data from a Python-based backend server. Make sure the server is running locally on `http://localhost:3000` and responds to the `POST /runFlow` endpoint. The server should return a JSON response in the following format:

```json
{
  "message": "```json\n{\n  \"engagement_metrics\": {\n    \"carousel\": {\n      \"avg_likes\": 105.0,\n      \"avg_shares\": 21.0,\n      \"avg_comments\": 11.25\n    },\n    \"image\": {\n      \"avg_likes\": 225.0,\n      \"avg_shares\": 50.0,\n      \"avg_comments\": 32.5\n    },\n    ...\n  },\n  \"insights\": \"# Social Media Post Engagement Analysis ...\"\n}\n```"
}
```

## How It Works

1. The app makes a `POST` request to the backend at startup to fetch engagement metrics and insights.
2. The response is parsed to extract:
   - `engagement_metrics`: Used to generate data for the bar chart.
   - `insights`: Rendered as Markdown content.
3. The chart dynamically updates based on the parsed data, and insights are displayed below the chart.

## Project Structure

```
src/
|-- App.js         # Main application component
|-- index.js       # Application entry point
```

## Future Enhancements

- Integrate with real-time analytics APIs for live updates.

## Acknowledgments

- [Chart.js](https://www.chartjs.org/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Axios](https://axios-http.com/)

---

## Happy coding! 🎉
