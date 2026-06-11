import { useState, useEffect, useRef } from "react";
import companyLogo from "./company.png";

const NAV_LINKS = ["Home", "Features", "Advantages", "Security", "About Us", "Contact"];

export default function RingPeWebsite() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prog, setProg] = useState(0);
  const [activeSlide, setActiveSlide] = useState(3);
  const [activeSection, setActiveSection] = useState("Home");
  
  const accumulatedRef = useRef(0);
  const MAX = 2400; 

  const showcaseImages = [
    { src: "/profile.png", title: "Profile" },
    { src: "/support.png", title: "Customer Support" },
    { src: "/dashboard.png", title: "Home Dashboard" },
    { src: "/billpayment.png", title: "Bill Payment" },
    { src: "/userprofile.png", title: "User Profile" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (prog >= 1) {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [prog]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % showcaseImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [showcaseImages.length]);

  useEffect(() => {
    const onWheel = (e) => {
      if (accumulatedRef.current < MAX || (accumulatedRef.current === MAX && e.deltaY < 0)) {
        if (window.scrollY <= 10) { 
          e.preventDefault();
          accumulatedRef.current = Math.min(Math.max(accumulatedRef.current + e.deltaY, 0), MAX);
          setProg(accumulatedRef.current / MAX);
        }
      }
    };
  
    let touchStartY = 0;
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      const delta = touchStartY - e.touches[0].clientY;
      if (accumulatedRef.current < MAX || (accumulatedRef.current === MAX && delta < 0)) {
        if (window.scrollY <= 10) {
          e.preventDefault();
          touchStartY = e.touches[0].clientY;
          accumulatedRef.current = Math.min(Math.max(accumulatedRef.current + delta * 2, 0), MAX);
          setProg(accumulatedRef.current / MAX);
        }
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const detectActiveSection = () => {
      if (window.scrollY < 300) {
        setActiveSection("Home");
        return;
      }

      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
        setActiveSection("Contact");
        return;
      }

      for (const link of NAV_LINKS) {
        if (link === "Home" || link === "Contact") continue;
        const id = link.toLowerCase().replace(" ", "-");
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(link);
            break;
          }
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", detectActiveSection);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", detectActiveSection);
    };
  }, []);

  const handleNavClick = (e, label) => {
    e.preventDefault();
    setMenuOpen(false);
    setActiveSection(label);
    
    if (window.self !== window.top) {
      window.parent.postMessage("CLOSE_RINGPE_OVERLAY", "http://localhost:3000");
      return;
    }
    
    if (label === "Home") {
      accumulatedRef.current = 0;
      setProg(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      accumulatedRef.current = MAX;
      setProg(1);
      
      setTimeout(() => {
        const targetId = label.toLowerCase().replace(" ", "-");
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  const heroProg = Math.min(prog / 0.5, 1); 
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const phase1 = easeOut(Math.min(heroProg / 0.5, 1));
  const phase2 = easeOut(Math.max((heroProg - 0.5) / 0.5, 0));

  const textOpacity = Math.max(1 - heroProg * 3, 0);
  const rotation    = (1 - heroProg) * 8;

  const leftStart  = -900;
  const rightStart =  900;
  const leftMeet   = -3;
  const rightMeet  =  4;
  const moveLeft   = -320;

  const leftX  = leftStart  + phase1 * (leftMeet  - leftStart)  + phase2 * moveLeft;
  const rightX = rightStart + phase1 * (rightMeet - rightStart) + phase2 * moveLeft;

  const panelOpacity = Math.max((phase2 - 0.3) / 0.7, 0);
  const panelY = (1 - panelOpacity) * 40;

  const section2Prog = Math.max((prog - 0.5) / 0.5, 0);
  const section2Ease = easeOut(section2Prog);

  const handTranslationX = (1 - section2Ease) * -100;
  const handOpacity = section2Prog > 0.02 ? 1 : 0; 

  const textFadeOpacity = Math.min(section2Prog / 0.8, 1);
  const textTranslationY = (1 - section2Ease) * 60;

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        * { box-sizing: border-box; scroll-behavior: smooth; }
        .nav-link:hover { color: #1a6ef5 !important; }
        .cta-btn:hover  { background: #0f55d4 !important; transform: translateY(-2px) !important; box-shadow: 0 6px 20px rgba(26,110,245,0.35) !important; }
        
        .store-badge { transition: all 0.2s ease; border: 1px solid rgba(255, 255, 255, 0.15); }
        .store-badge:hover { background: rgba(255, 255, 255, 0.12) !important; transform: translateY(-2px); border-color: rgba(255, 255, 255, 0.3); }

        .feature-card { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(26, 110, 245, 0.06); border-color: rgba(26, 110, 245, 0.25); }

        .adv-card { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid #eef2f8; }
        .adv-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(26, 110, 245, 0.05); border-color: rgba(26, 110, 245, 0.2); }
        
        .sec-card { transition: all 0.3s ease; border: 1px solid #1e293b; }
        .sec-card:hover { border-color: #3b82f6; background: #131c2e !important; transform: translateY(-3px); }

        @media (max-width: 991px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .burger-btn  { display: flex !important; }
          .split-container { flex-direction: column !important; justify-content: center !important; text-align: center !important; padding: 40px 24px !important; }
          .hand-image-wrapper { height: 35% !important; width: 100% !important; justify-content: center !important; transform: none !important; }
          .text-content-wrapper { width: 100% !important; padding: 0 !important; text-align: center !important; transform: none !important; }
          .features-grid-layout { grid-template-columns: 1fr !important; gap: 16px !important; }
          
          .responsive-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center !important; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .line2 { opacity: 0; animation: fadeInUp 0.7s 0.30s ease forwards; }
        .line3 { opacity: 0; animation: fadeInUp 0.7s 0.45s ease forwards; }

        @keyframes floatBob {
          0%, 100% { margin-top: 0px; }
          50%       { margin-top: -12px; }
        }
        .phone-left  { animation: floatBob 5s ease-in-out infinite; }
        .phone-right { animation: floatBob 6s ease-in-out infinite; animation-delay: 0.9s; }
        .hand-float  { animation: floatBob 7s ease-in-out infinite; animation-delay: 0.4s; }

        @keyframes panelUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .p-row { opacity: 0; animation: panelUp 0.55s ease forwards; }
      `}</style>

      {/* ══ HEADER ══ */}
      <header style={{ ...s.header, ...(scrolled ? s.headerShadow : {}) }}>
        <div style={s.inner}>
          
          <a href="#" style={s.logoWrap} onClick={(e) => handleNavClick(e, "Home")}>
            <img 
              src="/ringpelogo.png" 
              alt="RingPe" 
              style={{ ...s.logoImg, height: "42px" }}
              onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} 
            />
            <span style={{ ...s.logoFallback, display: "none" }}>
              <span style={{ color: "#0a1172" }}>Ring</span>
              <span style={{ color: "#1a6ef5" }}>Pe</span>
            </span>
          </a>

          <nav className="desktop-nav" style={s.nav}>
            {NAV_LINKS.map(l => {
              const isCurrent = l === activeSection;
              return (
                <div key={l} style={{ position: "relative", display: "inline-block" }}>
                  <a 
                    className="nav-link" 
                    href="#" 
                    style={{
                      ...s.navLink,
                      color: isCurrent ? "#1a6ef5" : "#1a1a2e",
                    }} 
                    onClick={(e) => handleNavClick(e, l)}
                  >
                    {l}
                  </a>
                  <span style={{
                    position: "absolute",
                    bottom: "-12px", 
                    left: "18px",
                    right: "18px",
                    height: "3px",
                    backgroundColor: "#1a6ef5",
                    borderRadius: "2px",
                    transform: isCurrent ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "center",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }} />
                </div>
              );
            })}
          </nav>

          <button className="desktop-cta cta-btn" style={s.cta} onClick={(e) => handleNavClick(e, "Contact")}>Get Started</button>

          <button className="burger-btn" style={s.burger} onClick={() => setMenuOpen(!menuOpen)}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                ...s.bar,
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px,5px)"
                  : i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "none"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </header>

      {/* ══ HERO CANVAS (SCREEN 1) ══ */}
      <section style={{ ...s.hero, position: prog >= 1 ? "absolute" : "fixed" }}>
        <img src="/hero-bg.png" alt="" style={s.heroBg} />

        <div style={s.row}>
          <div
            className="phone-left"
            style={{
              ...s.phoneCol,
              left: 0,
              transform: `translateY(-45%) translateX(${leftX}px) rotate(${-rotation}deg)`,
            }}
          >
            <img src="/left.png" alt="RingPe splash" style={s.phoneLeftImg} />
          </div>

          <div style={{
            ...s.centerCol,
            opacity: textOpacity,
            transform: `translateY(${heroProg * -24}px)`,
            pointerEvents: textOpacity <= 0 ? "none" : "auto",
          }}>
            <h1 style={s.brandName} className="line2">
              <span style={s.white}>Introducing</span>
            </h1>
            <div className="line2" style={s.heroLogoContainer}>
              <img src="/ringpelogo.png" alt="RingPe Logo" style={s.heroLogoImg} />
            </div>
            <p style={s.tagline} className="line3">
              The Future of Secure Digital Payments
            </p>
          </div>

          <div
            className="phone-right"
            style={{
              ...s.phoneCol,
              right: 0,
              transform: `translateY(-45%) translateX(${rightX}px) rotate(${rotation}deg)`,
            }}
          >
            <img src="/right.png" alt="RingPe app" style={s.phoneRightImg} />
          </div>

          <RightPanel opacity={panelOpacity} translateY={panelY} phase2={phase2} handleNavClick={handleNavClick} />
        </div>
      </section>

      {/* ══ DYNAMIC MOTION SECTION (SCREEN 2) ══ */}
      <section 
        id="features" 
        style={{ 
          ...s.nextSection, 
          opacity: prog >= 0.5 ? 1 : 0, 
          pointerEvents: prog >= 0.5 ? "auto" : "none" 
        }}
      >
        <div className="split-container" style={s.splitContainer}>
          
          <div className="hand-image-wrapper" style={{
            ...s.handWrapper,
            transform: `translateX(${handTranslationX}%)`,
            opacity: handOpacity
          }}>
            <img src="/hand2.png" alt="RingPe handheld device" className="hand-float" style={s.handImage} />
          </div>

          <div className="text-content-wrapper" style={{
            ...s.textWrapper,
            opacity: textFadeOpacity,
            transform: `translateY(${textTranslationY}px)`
          }}>
            <h2 style={s.featuresHeading}>Features & Capabilities</h2>
            
            <div className="features-grid-layout" style={s.featuresGrid}>
              <div className="feature-card" style={s.featureCardLayout}>
                <h3 style={s.featureTitle}>White-Labeling & Co-Branding</h3>
                <p style={s.featureText}>Tailor user experiences and digital wallet interfaces completely to fit your organization's brand identity.</p>
              </div>

              <div className="feature-card" style={s.featureCardLayout}>
                <h3 style={s.featureTitle}>Parental-Controlled Kids' Wallet</h3>
                <p style={s.featureText}>Establish safe transactional bounds with integrated guardrails, limits, and live ecosystem monitoring.</p>
              </div>

              <div className="feature-card" style={s.featureCardLayout}>
                <h3 style={s.featureTitle}>Digital Literacy Integration</h3>
                <p style={s.featureText}>Drive seamless financial inclusion via intuitive visual guidance features built right into user modules.</p>
              </div>

              <div className="feature-card" style={s.featureCardLayout}>
                <h3 style={s.featureTitle}>Automated Settlement & Grievance</h3>
                <p style={s.featureText}>Maximize infrastructure operational efficiency with robust log analytics and rapid issue resolution.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══ ADVANTAGES / APP SHOWCASE SECTION (PAGE 3) ══ */}
      <section id="advantages" style={{
        background: "linear-gradient(160deg, #f0f7ff, #deecfc)",
        minHeight: "800px",
        paddingTop: "140px",
        paddingBottom: "120px",
        color: "#1e293b",
        overflow: "hidden",
        width: "100%"
      }}>
        <div style={{ width: "100%", maxWidth: "1320px", margin: "0 auto", padding: 0 }}>

          <div style={{ textAlign: "center", marginBottom: "50px", padding: "0 40px" }}>
            <span style={{
              color: "#1a6ef5",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontSize: "12px"
            }}>
              App Showcase
            </span>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "56px",
              fontWeight: 700,
              marginTop: "16px",
              marginBottom: "24px",
              color: "#0a1172",
              letterSpacing: "-0.01em"
            }}>
              Experience RingPe in Action
            </h2>

            <p style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "18px",
              lineHeight: "1.8",
              color: "#475569",
              fontFamily: "'Inter', sans-serif"
            }}>
              A real look at the beautifully designed RingPe experience — intuitive, fast, and powerful.
            </p>
          </div>

          <div style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "460px",
            width: "100%", 
            margin: "0 auto",
          }}>
            {showcaseImages.map((item, index) => {
              const isActive = index === activeSlide;
              
              let offset = index - activeSlide;
              const total = showcaseImages.length;
              if (offset < -total / 2) offset += total;
              if (offset > total / 2) offset -= total;

              const absOffset = Math.abs(offset);
              const isVisible = absOffset <= 2;
              
              const translateX = offset * 135 - (offset * absOffset * 8);
              const scale = isActive ? 1.1 : 1 - absOffset * 0.12;
              const zIndex = 10 - absOffset;
              const opacity = isActive ? 1 : Math.max(0.2, 0.7 - absOffset * 0.2);

              if (!isVisible) return null;

              return (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    zIndex: zIndex,
                    opacity: opacity,
                    filter: isActive ? "none" : `blur(${absOffset * 1.5}px)`,
                    transition: "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pointerEvents: isActive ? "auto" : "none"
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    style={{
                      width: "175px",
                      borderRadius: "28px",
                      boxShadow: isActive
                        ? "0 20px 45px rgba(10, 17, 114, 0.25), 0 0 20px rgba(26, 110, 245, 0.15)"
                        : "0 8px 25px rgba(0, 0, 0, 0.12)",
                      border: isActive ? "2px solid #ffffff" : "1px solid rgba(0, 0, 0, 0.05)",
                      background: "#fff",
                      transition: "box-shadow 0.8s ease, border-color 0.8s ease"
                    }}
                  />

                  <p style={{
                    textAlign: "center",
                    marginTop: "16px",
                    color: "#0a1172",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(${isActive ? 0 : 8}px)`,
                    transition: "opacity 0.5s ease, transform 0.5s ease"
                  }}>
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "30px"
          }}>
            {showcaseImages.map((_, i) => (
              <span
                key={i}
                style={{
                  width: activeSlide === i ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: activeSlide === i ? "#1a6ef5" : "rgba(26, 110, 245, 0.2)",
                  transition: "all .4s ease",
                  display: "inline-block"
                }}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ══ SECURITY & INFRASTRUCTURE SECTION (PAGE 4) ══ */}
      <section id="security" style={s.pageSectionDark}>
        <div style={s.pageContainer}>
          <div style={{ ...s.sectionHeader, textAlign: "center" }}>
            <span style={{ ...s.sectionBadge, background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>System Architecture</span>
            <h2 style={{ ...s.sectionMainTitle, color: "#ffffff" }}>Hardened Enterprise Foundation</h2>
            <p style={{ ...s.sectionSubtitle, color: "#94a3b8" }}>Robust full-stack security designed to connect and safeguard massive corporate networks.</p>
          </div>

          <div className="responsive-grid" style={s.tripleGrid}>
            <div className="sec-card" style={s.secCardStyle}>
              <h4 style={s.secCardTitle}>Microservices Architecture</h4>
              <p style={s.secCardText}>Built upon entirely modular, decoupled microservices for high fault isolation and elastic operational scaling metrics.</p>
              <p style={s.secCardText}>Developed using a unified cross-platform full-stack JavaScript environment for reliable system architecture across Android, iOS, and PC browsers.</p>
            </div>

            <div className="sec-card" style={s.secCardStyle}>
              <h4 style={s.secCardTitle}>Hardened Safeguards</h4>
              <p style={s.secCardText}>Enterprise-grade cryptography layers deployed via cloud-hosted architecture configurations, guaranteeing strict PII data protection nodes.</p>
              <p style={s.secCardText}>Mitigates internal vector threats automatically using built-in backend log analytics monitoring infrastructure around the clock.</p>
            </div>

            <div className="sec-card" style={s.secCardStyle}>
              <h4 style={s.secCardTitle}>Host Integration Network</h4>
              <p style={s.secCardText}>An omnipresent Integration Layer and Omnichannel Hub that feeds real-time financial states smoothly into legacy core host networks.</p>
              <p style={s.secCardText}>Plugs instantly into third-party payment gateways, institutional CRMs, and cross-departmental record hubs via secure enterprise APIs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ABOUT US & COMPLIANCE SECTION (PAGE 5) ══ */}
      <section id="about-us" style={s.pageSectionWhite}>
        <div style={s.pageContainer}>
          <div style={s.complianceSplitLayout}>
            <div style={s.complianceTextSide}>
              <span style={s.sectionBadge}>Compliance Engine</span>
              <h2 style={s.sectionMainTitle}>Automated Reconciliation</h2>
              <p style={s.complianceBodyText}>
                Our innovative solutions streamline reconciliation efforts, which significantly improves compliance and mitigates any financial discrepancies in transactions across your organization's networks.
              </p>
              <p style={s.complianceBodyText}>
                Effective reconciliation processes enhance framework stability, safeguarding operations against potential operational risks and ensuring smooth financial operations for high-volume businesses and government targeted schemes.
              </p>
            </div>
            
            <div style={s.complianceGraphicSide}>
              <div style={s.graphicCard}>
                <div style={s.graphicHeader}>
                  <span style={s.graphicDot}></span>
                  <span style={s.graphicText}>Audit Health Check</span>
                </div>
                <div style={s.graphicMetric}>100%</div>
                <div style={s.graphicLabel}>Automated Discrepancy Resolution Logs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT FOOTER SECTION (PAGE 6) ══ */}
      <footer id="contact" style={s.footerSection}>
        <div style={s.pageContainer}>
          <div className="footer-grid" style={s.footerGridLayout}>
            <div style={s.footerBrandColumn}>
              <img src="/ringpelogo.png" alt="RingPe Logo" style={{ height: 44, width: "auto", marginBottom: 20, objectFit: "contain" }} />
              <p style={s.footerBrandText}>
                With Sabado's Digital Transformation Solutions, we aim to help businesses innovate, compete and win in a digital-first world. Because, we're here to help.
              </p>
            </div>

            <div style={s.footerInfoColumn}>
              <h5 style={s.footerColumnTitle}>Global Footprint</h5>
              <p style={s.footerAddressText}>
                <strong>United States HQ:</strong><br />
                860, Glenhill Dr, Fremont, CA – 94539, USA
              </p>
              <p style={s.footerAddressText}>
                <strong>India Development Center:</strong><br />
                309, Sai Paragon Meadows, Brookefields, BEML Layout, Bengaluru, India
              </p>
            </div>

            <div style={s.footerInfoColumn}>
              <h5 style={s.footerColumnTitle}>Connect Channels</h5>
              <p style={s.footerLinkItem}>
                <strong>Telephone:</strong> <a href="tel:+918861111186" style={s.footerInlineLink}>+91 88611 11186</a>
              </p>
              <p style={s.footerLinkItem}>
                <strong>Corporate Web:</strong> <a href="https://sabadotechnologies.com" target="_blank" rel="noreferrer" style={s.footerInlineLink}>sabadotechnologies.com</a>
              </p>
              <p style={s.footerLinkItem}>
                <strong>Product Hub:</strong> <a href="https://ringpe.com" target="_blank" rel="noreferrer" style={s.footerInlineLink}>ringpe.com</a>
              </p>
            </div>
          </div>

          <div style={s.footerBottomBar}>
            <p style={s.copyrightText}>&copy; {new Date().getFullYear()} Sabado Technologies. All rights reserved. Built with the latest web tech.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RightPanel({ opacity, translateY, phase2, handleNavClick }) {
  const triggered = phase2 > 0.3;
  const key = triggered ? "visible" : "hidden";

  return (
    <div style={{
      position: "absolute",
      right: "4%",
      top: "50%",
      transform: `translateY(calc(-50% + ${translateY}px))`,
      opacity,
      width: "38%",
      maxWidth: 480,
      textAlign: "left",
      pointerEvents: opacity < 0.1 ? "none" : "auto",
      willChange: "opacity, transform",
      padding: "36px 32px",
      background: "rgba(255, 255, 255, 0.04)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderRadius: "24px",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 20px 50px rgba(0, 20, 70, 0.3)",
    }}>
      {triggered && (
        <div key={key}>
          <div className="p-row" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 12px", animationDelay: "0s" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7eb8ff" }}></span>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(10px, 0.75vw, 11px)",
              fontWeight: 800,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#7eb8ff",
              margin: 0,
            }}>
              Digital Payments Platform
            </p>
          </div>

          <h2 className="p-row" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(48px, 5.2vw, 76px)",
            fontWeight: 600,
            margin: "0 0 2px",
            lineHeight: 1.0,
            letterSpacing: "-0.01em",
            animationDelay: "0.12s",
            color: "#ffffff"
          }}>
            RingPe
          </h2>

          <h3 className="p-row" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(18px, 1.8vw, 24px)",
            fontWeight: 500,
            fontStyle: "italic",
            color: "#bde3ff",
            margin: "0 0 20px",
            lineHeight: 1.3,
            animationDelay: "0.24s",
          }}>
            Your Custom Digital Wallet
          </h3>

          <div className="p-row" style={{
            height: "2px",
            width: "60px",
            background: "linear-gradient(90deg, #5599ff, rgba(85, 153, 255, 0))",
            marginBottom: "24px",
            animationDelay: "0.36s",
          }} />

          <p className="p-row" style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(13px, 1.05vw, 15px)",
            fontWeight: 400,
            color: "rgba(235, 243, 255, 0.9)",
            lineHeight: "1.75",
            margin: "0 0 32px 0",
            animationDelay: "0.48s",
          }}>
            A revolutionary payment platform that sets itself apart from traditional digital wallets by offering a unique white-labeling solution tailored to the specific needs of organizations.
          </p>

          <div className="p-row" style={{ display: "flex", animationDelay: "0.6s" }}>
            <a 
              href="https://play.google.com/store/apps/details?id=com.ringpe&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="store-badge"
              style={{ ...s.badgeStyle, textDecoration: "none" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style={{ marginRight: "8px" }}>
                <path d="M5.23 3.08a2.38 2.38 0 0 0-.48 1.63v14.58c0 .64.18 1.2.49 1.64l8.15-8.15L5.23 3.08zm13.11 6.37l-2.6-1.5L13.88 9.8l2.12 2.12 2.34-1.35c.87-.5 1.1-.1.1-.56 0-.45-.22-.05-1.1-.56zm-5.36-.61L10.6 6.46 5.92 3.77c-.12-.07-.27-.1-.4-.08l7.85 7.85 1.51-1.51zm-2.38 5.31l2.38-2.38 1.51 1.51-7.85 7.85c.13.02.28-.01.4-.08l4.68-2.69-1.12-2.21z"/>
              </svg>
              <div style={{ textAlign: "left" }}>
                <span style={{ display: "block", fontSize: "9px", textTransform: "uppercase", opacity: 0.7, fontWeight: 500 }}>Get it on</span>
                <span style={{ display: "block", fontSize: "13px", fontWeight: 600, marginTop: "-2px" }}>Google Play</span>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  root: {
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    background: "#fff",
    width: "100vw",
    minHeight: "100vh",
  },
  header: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 200,
    background: "#fff",
    borderBottom: "1px solid #f0f0f0",
    transition: "box-shadow 0.3s",
  },
  headerShadow: { boxShadow: "0 2px 20px rgba(0,0,0,0.09)" },
  inner: {
    maxWidth: 1320,
    margin: "0 auto",
    padding: "0 40px",
    height: 82,
    display: "flex",
    alignItems: "center",
  },
  logoWrap: { display: "flex", alignItems: "center", textDecoration: "none", marginRight: 52, flexShrink: 0 },
  logoImg:      { height: 48, width: "auto", objectFit: "contain" },
  logoFallback: { fontSize: 28, fontWeight: 800, letterSpacing: -0.5, alignItems: "center" },
  nav:          { display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center" },
  navLink: {
    color: "#1a1a2e", textDecoration: "none", fontSize: 16, fontWeight: 600,
    padding: "7px 18px", borderRadius: 8, letterSpacing: 0.2,
    transition: "color 0.2s", whiteSpace: "nowrap",
  },
  cta: {
    background: "#1a6ef5", color: "#fff", border: "none", borderRadius: 10,
    padding: "13px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer",
    letterSpacing: 0.2, transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
    flexShrink: 0, marginLeft: 24, whiteSpace: "nowrap",
  },
  burger: {
    display: "none", flexDirection: "column", justifyContent: "center", gap: 5,
    background: "none", border: "none", cursor: "pointer", padding: 8, marginLeft: "auto",
  },
  bar: { display: "block", width: 25, height: 2.5, background: "#222", borderRadius: 2, transition: "transform 0.25s, opacity 0.2s" },
  mobileMenu: { background: "#fff", borderTop: "1px solid #f0f0f0", padding: "16px 28px 24px", display: "flex", flexDirection: "column", gap: 2 },
  mobileLink: { color: "#1a1a2e", textDecoration: "none", fontSize: 17, fontWeight: 600, padding: "12px 0", borderBottom: "1px solid #f5f5f5" },
  
  hero: {
    top: 0, left: 0,
    width: "100vw",
    height: "100vh",
    paddingTop: 82,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  heroBg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 },
  row: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "calc(100vh - 82px)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  phoneCol: { position: "absolute", top: "50%", transformOrigin: "center center", willChange: "transform", display: "flex", alignItems: "center", justifyStyle: "center" },
  phoneLeftImg: { height: "72vh", width: "auto", display: "block", filter: "drop-shadow(-8px 18px 28px rgba(0,0,20,0.65))" },
  phoneRightImg: { height: "80vh", width: "auto", display: "block", filter: "drop-shadow(8px 18px 28px rgba(0,0,20,0.65))" },
  centerCol: { flex: "0 0 45%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", willChange: "opacity, transform" },
  brandName: { fontFamily: "'Times New Roman', Times, serif", fontWeight: 600, fontStyle: "normal", fontSize: "clamp(46px, 5.2vw, 72px)", margin: "0 0 4px", lineHeight: 1.15, letterSpacing: "0.5px", textShadow: "0 4px 28px rgba(0,0,60,0.55)" },
  white: { color: "#ffffff" },
  heroLogoContainer: { margin: "8px 0 0px", display: "flex", justifyContent: "center", alignItems: "center", width: "100%" },
  heroLogoImg: { maxWidth: "340px", height: "auto", objectFit: "contain", filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.3))", WebkitBoxReflect: "below 2px linear-gradient(transparent, transparent 35%, rgba(255,255,255,0.18))" },
  tagline: { fontFamily: "'Noto Serif', serif", fontSize: "clamp(16px, 1.45vw, 22px)", fontStyle: "italic", color: "rgba(255,255,255,0.85)", margin: "0", marginTop: "20px", position: "relative", zIndex: 10, lineHeight: 1.75, textShadow: "0 2px 10px rgba(0,0,0,0.5)" },
  badgeStyle: { display: "inline-flex", alignItems: "center", background: "rgba(255, 255, 255, 0.06)", padding: "8px 18px", borderRadius: "12px", cursor: "pointer", color: "#ffffff", fontFamily: "'Inter', sans-serif", userSelect: "none" },
  
  nextSection: {
    position: "relative",
    zIndex: 10,
    marginTop: "100vh", 
    width: "100vw",
    height: "100vh", 
    background: "#ffffff",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  splitContainer: {
    width: "100vw",
    maxWidth: "100%", 
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0
  },
  handWrapper: {
    width: "30vw", 
    height: "100%",
    display: "flex",
    alignItems: "center", 
    justifyContent: "flex-start", 
    paddingLeft: 0,
    marginLeft: 0,
    willChange: "transform, opacity",
    transition: "transform 0.05s linear"
  },
  handImage: {
    maxHeight: "56%", 
    width: "auto",
    objectFit: "contain",
    display: "block",
    marginLeft: 0 
  },
  textWrapper: {
    width: "70vw", 
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "left", 
    willChange: "transform, opacity",
    paddingLeft: "2vw",
    paddingRight: "6vw",
    transition: "transform 0.05s linear, opacity 0.05s linear"
  },
  featuresHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(32px, 3.2vw, 46px)",
    fontWeight: "600",
    lineHeight: "1.2", 
    color: "#1a1a2e",
    letterSpacing: "-0.01em",
    margin: "0 0 24px 0"
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    width: "100%"
  },
  featureCardLayout: {
    background: "#f8faff",
    border: "1px solid #eef3fb",
    borderRadius: "16px",
    padding: "22px 24px",
    textAlign: "left"
  },
  featureTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a6ef5",
    margin: "0 0 8px 0",
    letterSpacing: "-0.01em"
  },
  featureText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13.5px",
    fontWeight: "400",
    color: "#4a4a5a",
    lineHeight: "1.55",
    margin: 0
  },
  pageSectionWhite: {
    position: "relative",
    width: "100vw",
    padding: "120px 0",
    background: "#ffffff",
    display: "flex",
    justifyContent: "center"
  },
  pageSectionDark: {
    position: "relative",
    width: "100vw",
    padding: "120px 0",
    background: "#0b1329",
    display: "flex",
    justifyContent: "center"
  },
  pageContainer: {
    width: "100%",
    maxWidth: "1320px",
    padding: "0 40px"
  },
  sectionHeader: {
    marginBottom: "64px",
    textAlign: "left"
  },
  sectionBadge: {
    display: "inline-block",
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "#1a6ef5",
    background: "rgba(26, 110, 245, 0.06)",
    padding: "6px 14px",
    borderRadius: "20px",
    marginBottom: "16px"
  },
  sectionMainTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(36px, 3.8vw, 52px)",
    fontWeight: "600",
    color: "#1a1a2e",
    margin: "0 0 12px 0",
    letterSpacing: "-0.01em"
  },
  sectionSubtitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "clamp(15px, 1.15vw, 18px)",
    fontWeight: "400",
    color: "#64748b",
    margin: 0,
    lineHeight: "1.5"
  },
  tripleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "32px",
    width: "100%"
  },
  advCardStyle: {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "20px"
  },
  advCardTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "26px",
    fontWeight: "600",
    color: "#1a1a2e",
    margin: "0 0 18px 0"
  },
  advCardText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    color: "#4a4a5a",
    lineHeight: "1.65",
    margin: "0 0 14px 0"
  },
  secCardStyle: {
    background: "#111a2e",
    padding: "32px",
    borderRadius: "20px"
  },
  secCardTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "26px",
    fontWeight: "600",
    color: "#ffffff",
    margin: "0 0 18px 0"
  },
  secCardText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    color: "#94a3b8",
    lineHeight: "1.65",
    margin: "0 0 14px 0"
  },
  complianceSplitLayout: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "64px",
    width: "100%"
  },
  complianceTextSide: {
    flex: "0 0 55%"
  },
  complianceBodyText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "16px",
    color: "#4a4a5a",
    lineHeight: "1.75",
    margin: "0 0 20px 0"
  },
  complianceGraphicSide: {
    flex: "1",
    display: "flex",
    justifyContent: "center"
  },
  graphicCard: {
    background: "linear-gradient(135deg, #1a6ef5, #0a1172)",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 20px 40px rgba(10,17,114,0.15)",
    textAlign: "center"
  },
  graphicHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "20px"
  },
  graphicDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#4ade80"
  },
  graphicText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "12px",
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.05em",
    textTransform: "uppercase"
  },
  graphicMetric: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "72px",
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: "1",
    marginBottom: "12px"
  },
  graphicLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    color: "rgba(255,255,255,0.85)",
    lineHeight: "1.4"
  },
  footerSection: {
    background: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
    padding: "80px 0 30px 0",
    width: "100vw",
    display: "flex",
    justifyContent: "center"
  },
  footerGridLayout: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: "64px",
    width: "100%",
    marginBottom: "60px"
  },
  footerBrandColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  footerBrandText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.65",
    margin: 0
  },
  footerInfoColumn: {
    textAlign: "left"
  },
  footerColumnTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    fontWeight: "700",
    color: "#1a1a2e",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 24px 0"
  },
  footerAddressText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    color: "#4a4a5a",
    lineHeight: "1.6",
    margin: "0 0 20px 0"
  },
  footerLinkItem: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    color: "#4a4a5a",
    margin: "0 0 14px 0"
  },
  footerInlineLink: {
    color: "#1a6ef5",
    textDecoration: "none",
    fontWeight: "500"
  },
  footerBottomBar: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "30px",
    textAlign: "center"
  },
  copyrightText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0
  },
  carouselBtn: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,.25)",
    background: "transparent",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer"
  },
};