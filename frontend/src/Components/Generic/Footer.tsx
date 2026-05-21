import { Linkedin, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div className="text-center sm:text-left">
          <h2 className="text-base font-semibold mb-4">Legal</h2>
          <ul className="space-y-2">
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/datenschutz" className="hover:underline">Datenschutz</a></li>
          </ul>
        </div>
        <div className="text-center">
          <h2 className="text-base font-semibold mb-4">Contacts</h2>
          <div className="flex justify-center space-x-6">
            <a href="https://www.linkedin.com/in/sebastian-feustel" className="hover:text-white" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com/53845714nF/dinofind" className="hover:text-white" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <a href="mailto:dinofind@hackwiki.de" className="hover:text-white" aria-label="E-Mail">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <h2 className="text-base font-semibold mb-4">Copyright</h2>
          <p className="text-sm">&copy; 2026 Sebastian Feustel</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;