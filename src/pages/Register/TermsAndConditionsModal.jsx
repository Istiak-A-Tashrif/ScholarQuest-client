import React, { useState, useEffect } from "react";

const TermsAndConditionsModal = ({ isOpen, onDecline, onAccept }) => {
  const [modalHeight, setModalHeight] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Calculate modal height dynamically
      const modalContent = document.getElementById("modal-content");
      if (modalContent) {
        const contentHeight = modalContent.offsetHeight;
        setModalHeight(contentHeight + 40); // Add some padding for better spacing
      }
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-800 bg-opacity-50 ${
        isOpen ? "" : "hidden"
      } z-20`}
    >
      <div
        className="bg-white text-gray-900 p-6 rounded-lg max-w-lg"
        style={{
          maxHeight: `calc(100% - 40px)`,
          height: modalHeight,
          overflowY: "auto",
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
        <div id="modal-content">
          <p className="mb-4">
            Welcome to our platform. By registering, you agree to the following
            terms and conditions:
          </p>
          <ol className="list-decimal pl-4 mb-4">
            <li className="mb-2">
              This platform is provided on an "as is" and "as available" basis.
              We make no representations or warranties of any kind, express or
              implied, as to the operation of this platform or the information,
              content, materials, or products included on it.
            </li>
            <li className="mb-2">
              You must be at least 18 years old to register on this platform.
            </li>
            <li className="mb-2">
              You agree to use this platform only for lawful purposes and in
              accordance with these terms and conditions.
            </li>
            <li className="mb-2">
              We reserve the right to terminate or suspend your account at any
              time without prior notice if we believe that you have violated
              these terms and conditions.
            </li>
            <li className="mb-2">
              We reserve the right to update or modify these terms and
              conditions at any time without prior notice. Your continued use of
              the platform after any such changes indicates your acceptance of
              the modified terms and conditions.
            </li>
          </ol>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onDecline}
            className="bg-red-500 text-white py-2 px-4 rounded mr-2"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
