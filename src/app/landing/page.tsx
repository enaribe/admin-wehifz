import {
  BookOpen,
  Users,
  Flame,
  Star,
  Shield,
  Smartphone,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page" style={{ background: 'linear-gradient(180deg, #0D2818 0%, #0A1A0A 50%, #061208 100%)', minHeight: '100vh', color: '#fff' }}>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,26,10,0.85)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>Wehifz</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a
              href="https://expo.dev/accounts/enatech/projects/wehifz/builds/21acb1c1-2152-4790-8c27-84780384ff40"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', color: '#fff', padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              Télécharger <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center', position: 'relative' }}>
        {/* Glow background */}
        <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(76,175,80,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.25)', borderRadius: 999, padding: '6px 16px', marginBottom: 32 }}>
          <Star size={13} color="#4CAF50" fill="#4CAF50" />
          <span style={{ fontSize: 13, color: '#81C784', fontWeight: 600 }}>Mémorisation du Coran simplifiée</span>
        </div>

        <h1 style={{ fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 24 }}>
          Mémorisez le Coran
          <br />
          <span style={{ background: 'linear-gradient(135deg, #4CAF50, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ensemble
          </span>
        </h1>

        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', maxWidth: 540, margin: '0 auto 48px', lineHeight: 1.7 }}>
          Wehifz vous accompagne dans votre parcours de mémorisation grâce à des défis personnalisés, un suivi de progression et une communauté engagée.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }} id="download">
          <a
            href="https://expo.dev/accounts/enatech/projects/wehifz/builds/21acb1c1-2152-4790-8c27-84780384ff40"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: 'linear-gradient(135deg, #3DDC84, #2E7D32)', color: '#fff', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(76,175,80,0.35)' }}
          >
            <Smartphone size={18} />
            Android — Télécharger
          </a>
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '16px 36px', borderRadius: 14, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <Smartphone size={18} color="rgba(255,255,255,0.4)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>BIENTÔT DISPONIBLE</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>App Store iOS</div>
            </div>
          </div>
        </div>

        {/* App preview mockup */}
        <div style={{ marginTop: 80, display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'flex-end' }}>
          {/* Phone mockup center */}
          <div style={{ width: 240, height: 480, borderRadius: 36, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Bienvenue</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Salam, Ahmed</div>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: 17, background: 'rgba(76,175,80,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={16} color="#FFB74D" fill="#FFB74D" />
                </div>
              </div>

              {/* Verse card */}
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, marginBottom: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 11, color: '#4CAF50', fontWeight: 600, marginBottom: 10 }}>JOUR 3 • AL-BAQARAH</div>
                <div style={{ fontSize: 18, textAlign: 'right', lineHeight: 1.8, color: '#fff', marginBottom: 8 }}>
                  ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                  &quot;Allah - pas de divinité sauf Lui...&quot;
                </div>
              </div>

              {/* Progress card */}
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 14, marginBottom: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Al-Baqarah</span>
                  <span style={{ fontSize: 12, color: '#4CAF50', fontWeight: 700 }}>42%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '42%', background: 'linear-gradient(90deg, #4CAF50, #81C784)', borderRadius: 3 }} />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', borderRadius: 12, padding: '10px 0', textAlign: 'center', fontSize: 12, fontWeight: 600 }}>
                  Créer un défi
                </div>
                <div style={{ flex: 1, background: 'linear-gradient(135deg, #D4AF37, #B8860B)', borderRadius: 12, padding: '10px 0', textAlign: 'center', fontSize: 12, fontWeight: 600 }}>
                  Communauté
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48 }}>
          {[
            { value: '5,000+', label: 'Utilisateurs actifs', color: '#4CAF50' },
            { value: '114', label: 'Sourates disponibles', color: '#D4AF37' },
            { value: '6,236', label: 'Versets indexés', color: '#4FC3F7' },
            { value: '30+', label: 'Juz disponibles', color: '#FFB74D' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: stat.color, letterSpacing: '-1px', marginBottom: 6 }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.25)', borderRadius: 999, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: '#81C784', fontWeight: 600 }}>Fonctionnalités</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
            Tout pour votre parcours
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto' }}>
            Des outils pensés pour rendre la mémorisation du Coran accessible, régulière et communautaire.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {[
            {
              icon: <BookOpen size={22} color="#4CAF50" />,
              bg: 'rgba(76,175,80,0.12)',
              title: 'Défis personnalisés',
              desc: 'Créez votre propre programme de mémorisation adapté à votre rythme et niveau, ou rejoignez un défi communautaire.',
              badge: 'Populaire',
              badgeColor: '#4CAF50',
            },
            {
              icon: <Flame size={22} color="#FFB74D" />,
              bg: 'rgba(255,183,77,0.12)',
              title: 'Suivi de progression',
              desc: 'Suivez votre streak quotidien, vos versets mémorisés et votre progression dans chaque sourate en temps réel.',
            },
            {
              icon: <Users size={22} color="#D4AF37" />,
              bg: 'rgba(212,175,55,0.12)',
              title: 'Communauté engagée',
              desc: 'Rejoignez des défis collectifs, encouragez-vous mutuellement et mémorisez le Coran ensemble.',
            },
            {
              icon: <Shield size={22} color="#4FC3F7" />,
              bg: 'rgba(79,195,247,0.12)',
              title: 'Mode hors ligne',
              desc: 'Accédez à vos sourates et suivez vos défis même sans connexion internet grâce au cache intelligent.',
            },
            {
              icon: <Star size={22} color="#D4AF37" />,
              bg: 'rgba(212,175,55,0.12)',
              title: 'Verset du jour',
              desc: 'Découvrez chaque jour les versets à mémoriser selon votre programme avec texte arabe et traduction.',
            },
            {
              icon: <Smartphone size={22} color="#81C784" />,
              bg: 'rgba(129,199,132,0.12)',
              title: 'Application native',
              desc: 'Disponible sur iOS et Android avec une expérience fluide et une interface soignée adaptée à votre quotidien.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, position: 'relative', transition: 'border-color 0.2s' }}
            >
              {feature.badge && (
                <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 999, padding: '2px 10px', fontSize: 11, color: '#81C784', fontWeight: 700 }}>
                  {feature.badge}
                </div>
              )}
              <div style={{ width: 44, height: 44, borderRadius: 12, background: feature.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{feature.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
              Comment ça marche ?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)' }}>
              Commencez votre parcours en 3 étapes simples
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Créez votre compte', desc: 'Inscrivez-vous en quelques secondes et configurez votre profil.' },
              { step: '02', title: 'Choisissez un défi', desc: 'Sélectionnez une sourate ou un juz selon votre niveau et vos objectifs.' },
              { step: '03', title: 'Mémorisez chaque jour', desc: 'Suivez votre programme quotidien et progressez à votre rythme.' },
            ].map((item, i) => (
              <div key={item.step} style={{ display: 'flex', gap: 20 }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: i === 0 ? 'linear-gradient(135deg, #4CAF50, #2E7D32)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclus */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '96px 24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, padding: '56px 48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
            Tout est gratuit
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 40 }}>
            Wehifz est entièrement gratuit. Mémorisez le Coran sans limites.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40, textAlign: 'left' }}>
            {[
              'Accès à toutes les sourates',
              'Défis illimités',
              'Mode hors ligne',
              'Suivi de progression',
              'Communauté active',
              'Notifications quotidiennes',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={16} color="#4CAF50" fill="rgba(76,175,80,0.15)" />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://expo.dev/accounts/enatech/projects/wehifz/builds/21acb1c1-2152-4790-8c27-84780384ff40"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: 'linear-gradient(135deg, #3DDC84, #2E7D32)', color: '#fff', padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(76,175,80,0.3)' }}
            >
              <Smartphone size={17} />
              Android
            </a>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '14px 32px', borderRadius: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Smartphone size={17} color="rgba(255,255,255,0.35)" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.5px' }}>BIENTÔT</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>App Store</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Wehifz</span>
          </div>
          <div />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Wehifz. بِسْمِ اللّٰهِ
          </p>
        </div>
      </footer>
    </div>
  );
}
