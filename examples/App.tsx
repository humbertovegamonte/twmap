import React from 'react';
import { Card, Grid, Header } from './components';

const App: React.FC = () => {
  const handleCardClick = () => {
    alert('Card clicked!');
  };

  return (
    <div className="tw-e879e4">
      <Header />
      
      <main className="tw-b">
        <section className="tw-c">
          <h2 className="tw-a7190a">Features</h2>
          
          <Grid>
            <Card
              title="Fast Performance"
              description="Lightning fast rendering with optimized components and minimal bundle size."
              buttonText="Learn More"
              onClick={handleCardClick}
            />
            <Card
              title="Modern Design"
              description="Beautiful, responsive design built with Tailwind CSS and modern best practices."
              buttonText="View Examples"
              onClick={handleCardClick}
            />
            <Card
              title="Easy to Use"
              description="Simple API and comprehensive documentation make it easy to get started."
              buttonText="Get Started"
              onClick={handleCardClick}
            />
          </Grid>
        </section>

        <section className="tw-d">
          <div className="tw-e">
            <h3 className="tw-f">Ready to get started?</h3>
            <p className="tw-f3dfc6">Join thousands of developers building amazing apps.</p>
            <div className="tw-g">
              <button className="tw-h">
                Start Building
              </button>
              <button className="tw-i">
                View Docs
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="tw-j">
        <div className="tw-k">
          <p className="tw-d667ed">&copy; 2025 My App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
