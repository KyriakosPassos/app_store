const Styles = ({ darkMode }: { darkMode: boolean }) => (
  <style>{`
    /* Basic Reset & Font */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "Inter", sans-serif;
      background-color:${darkMode ? "#111827" : "white"};
      color: #ffffff;
      min-height: 100vh;
      transition: all 1s ease-in-out;
      overflow-x: auto;
    }

    /* App Container */
    .app-container {
      max-width: 100vw;
      padding: 2rem;
    }
    @media (max-width: 640px) {
      .app-container {
        padding: 1rem;
      }
    }

    /* Header Styles */
    .header-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-align: center;
    }

    @media (max-width: 640px) {
      .header-title {
        font-size: 1.875rem;
      }
     
    }

    /* Board Grid Layout */
    .board-grid {
      display: grid;
      border-radius:1rem;
      gap: 1.5rem;
      padding:1rem 1rem 2rem 1rem;
      overflow-x: auto;
      margin-bottom:1rem;
      min-height:80vh;
    }
    
    /* --- Drag & Drop Visual Feedback --- */
    /* By default, when dragging, all columns are blurred */
    .is-dragging .animated-border-column {
      filter: blur(3px);
      transition: all 0.2s ease-in-out;
    }
    
    /* Hide the border and pulse for all columns by default during a drag */
    .is-dragging .animated-border-column::before,
    .is-dragging .animated-border-column::after {
        background: transparent;
    }

    /* For valid targets, remove the blur */
    .is-dragging .is-valid-target {
        filter: none;
    }

    /* And restore the border and pulse for the valid targets */
    .is-dragging .is-valid-target::before {
        background: var(--border-color, #4f4e50);
    }

    .is-dragging .is-valid-target::after {
        background: var(--border-color, #4f4e50);
    }

    /* Highlight for when hovering over a valid column */
    .drag-over {
      outline: 2px dashed #556075;
      outline-offset: 4px;
    }


    /* --- Animation Styles --- */
    .animated-border-column {
      position: relative;
      border-radius: 1rem;
      padding: 2px;
      background: transparent;
      transition: all 0.2s ease-in-out;
    }

    .animated-border-column::before {
      content: "";
      position: absolute;
      inset: 0;
      background: var(--border-color, #4f4e50);
      border-radius: 1rem;
      z-index: 0;
    }

    .animated-border-column::after {
      content: "";
      position: absolute;
      background: var(--border-color, #4f4e50);
      border-radius: 1rem;
      z-index: -1;
      inset: var(--incoming-inset,-1px);
      filter: var(--incoming-blur);
      animation: var(--incoming-animation);
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.01);
        opacity: 0.2;
      }
      100% {
        transform: scale(1);
        opacity: 0.7;
      }
    }

    /* Column Styles */
    .column-content {
      position: relative;
      z-index: 2;
      background-color: #1f2d37;
      border-radius: 0.875rem;
      padding: 1rem;
      min-height: 200px;
      height: 100%;
    }

    .column-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }

    .column-header-dot {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 9999px;
      margin-right: 0.75rem;
    }

    .column-header-title {
      font-size: 1.125rem;
      font-weight: 700;
    }

    .tickets-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width:15rem;
    }

    /* Ticket Styles */
    .ticket {
      background-color: #374151;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
    }

    .ticket:hover {
      cursor: pointer;
      transform: scale(1.05);
    }
    
    .dragging {
        opacity: 0.5;
    }

    .ticket-title {
    word-break: break-word;
      font-weight: 600;
      overflow: hidden; 
      display: -webkit-box;
      -webkit-line-clamp: 2; 
      -webkit-box-orient: vertical;
    }

    .ticket-id {
      font-size: 0.75rem;
      margin-top: 0.25rem;
      color:white;
    }
  `}</style>
);

export default Styles;
