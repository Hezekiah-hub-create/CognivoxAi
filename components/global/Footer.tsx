const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 bottom-0 w-full">
      <div className="container mx-auto py-6 px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} AI SaaS. All rights reserved.
        </p>
        <p className="mt-1">Powered by ZekDev.</p>
      </div>
    </footer>
  );
};

export default Footer;