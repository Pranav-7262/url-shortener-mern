const Footer = () => {
  return (
    <footer className="w-full text-center py-6 text-sm text-gray-400">
      <div>
        © {new Date().getFullYear()} Shorty — Built with React, Tailwind &
        DaisyUI
      </div>
    </footer>
  );
};

export default Footer;
