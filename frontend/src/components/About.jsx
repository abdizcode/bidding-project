import React from "react";

const About = () => {
  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <div className="max-w-4xl w-full bg-cyan-200 shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">
          About Us
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Welcome to our Auction System, your premier platform for dynamic and
          secure online auctions. Our platform is designed to connect vendors
          and bidders in a seamless, efficient, and engaging environment. Whether you're here to sell unique items, bid on exclusive products, or manage auctions as an administrator, our system ensures a smooth and transparent experience.
        </p>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          At our core, we aim to revolutionize the auction industry by leveraging
          cutting-edge technology. Our mission is to create a fair and
          trustworthy platform where sellers can maximize the value of their
          goods and buyers can discover rare and valuable items in a competitive
          yet transparent bidding process.
        </p>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-700 text-lg mb-4">
          <li>
            <strong>For Vendors:</strong> Easy listing management, detailed analytics, and customizable auction settings.
          </li>
          <li>
            <strong>For Bidders:</strong> Intuitive bidding system, real-time updates, and a secure payment gateway.
          </li>
          <li>
            <strong>For Admins:</strong> Comprehensive tools to monitor and manage the platform, ensuring compliance and efficiency.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
          Why Choose Us?
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Our platform stands out due to its commitment to user satisfaction, security, and innovation. With advanced features such as real-time notifications, robust security protocols, and a user-friendly interface, we provide an unparalleled auction experience. Whether you're a seasoned auction participant or new to the world of online bidding, our system is tailored to meet your needs.
        </p>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
          Our Journey
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Founded with the vision of transforming the auction landscape, our platform has grown from a small startup to a thriving community of vendors and bidders. Our team of dedicated developers, designers, and auction experts continuously works to enhance the platform, ensuring it remains at the forefront of the industry.
        </p>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
          Contact Us
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Have questions, feedback, or need assistance? Our support team is
          here to help! Reach out to us at{" "}
          <a href="mailto:support@auctionsystem.com" className="text-blue-300 underline">
            support@auctionsystem.com
          </a>{" "}
          or visit our{" "}
          <a href="/contact" className="text-blue-300 underline">
            Contact Page
          </a>
          . We value your input and are always eager to hear from our users.
        </p>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
          Join Our Community
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Ready to dive into the exciting world of auctions? Sign up today and
          become a part of our growing community. Whether you’re looking to sell, bid, or manage, our platform is here to empower you every step of the way. Thank you for choosing us as your trusted auction partner!
        </p>
      </div>
    </div>
  );
};

export default About;