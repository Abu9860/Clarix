export default function Footer() {
    return (
        <footer className="clarix-footer hidden sm:flex">
            <span>© 2026 Clarix. All rights reserved.</span>
            <div className="flex items-center gap-3">
                <a href="#" className="text-light-muted dark:text-dark-muted hover:text-brand-500 transition-colors duration-250 text-2xs">Privacy</a>
                <span className="text-light-muted dark:text-dark-muted text-2xs">·</span>
                <a href="#" className="text-light-muted dark:text-dark-muted hover:text-brand-500 transition-colors duration-250 text-2xs">Terms</a>
                <span className="text-light-muted dark:text-dark-muted text-2xs">·</span>
                <a href="#" className="text-light-muted dark:text-dark-muted hover:text-brand-500 transition-colors duration-250 text-2xs">Contact</a>
            </div>
        </footer>
    );
}
