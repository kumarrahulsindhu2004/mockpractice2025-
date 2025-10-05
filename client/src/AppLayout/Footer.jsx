import "./footer.css"

function Footer() {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Mock Practice. All rights reserved.</p>
        <nav className="footer-nav" aria-label="Footer">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
