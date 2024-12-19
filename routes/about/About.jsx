import React from 'react';
import './About.css';

function About() {
  return (
    <div className="aboutContainer">
      <div className="aboutHeader">
        <h1 className="aboutTitle">PRAKRITI: The Techno-Environmental Club</h1>
      </div>
      <div className="aboutContent">
      <div className="club-introduction">
  <p>
    <strong>Prakriti</strong>, the Techno-Environmental Club of NIT Durgapur, is a pioneering force for environmental awareness and action among engineers. We challenge the notion that technology and nature are at odds, striving to shape <em>Green Engineers</em>—innovators who champion sustainability and work towards minimizing environmental risks.
  </p>

  <br/>

  <p>
    Guided by the principles of <strong>Perseverance</strong>, <strong>Sustenance</strong>, and <strong>Progress</strong>, Prakriti has achieved remarkable milestones since its inception. The club has consistently worked to build a community of engineers who understand the delicate balance between technological advancement and environmental protection.
  </p>

  <br/>

  <div className="initiatives">
    <p>
      Through a variety of impactful initiatives like afforestation drives, waste management campaigns, workshops, and awareness programs, Prakriti promotes collective responsibility and environmental stewardship. By blending education, innovation, and action, the club envisions a future where progress and ecological harmony coexist seamlessly.
    </p>
  </div>

  <br/>

  <p>
    <strong>Join us</strong> as we innovate, inspire, and preserve—creating a sustainable future for all.
  </p>
</div>

     
      </div>
    </div>
  );
}

export default About;
