// components/DashboardCard.jsx
import React from 'react';

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-peach text-white p-6 rounded-lg shadow-lg flex items-center gap-4 bg-cyan-800">
    <div className="text-4xl text-accent">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-2xl">{value}</p>
    </div>
  </div>
);

export default DashboardCard;
 