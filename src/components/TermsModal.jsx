import React from 'react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="bg-[#141416] border border-[#333338] max-w-3xl w-full max-h-[85vh] flex flex-col relative shadow-2xl overflow-hidden rounded-sm">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#25252c] flex justify-between items-center bg-[#0d0d0f] flex-shrink-0">
          <div className="flex items-center space-x-3">
            <img
              src="/images/logo/mcoc_nexus.png"
              alt="MCOC NEXUS"
              className="w-8 h-8 object-contain rounded-full shadow-[0_0_8px_rgba(225,255,0,0.4)]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/logo.png";
              }}
            />
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-wider text-white">
                MCOC NEXUS — TERMS OF SERVICE
              </h3>
              <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-widest font-inter">
                Last Updated: August 25, 2026
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c20] transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-300 font-inter leading-relaxed custom-scrollbar">
          
          <div className="bg-[#181820] border border-[#2c2c36] p-4 rounded-sm">
            <p className="text-gray-200">
              Welcome to <strong className="text-brand-yellow">MCOC NEXUS</strong>. By accessing or using the MCOC NEXUS website and its services, you agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use the website.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">1.</span> About MCOC NEXUS
            </h4>
            <p>
              MCOC NEXUS is an independent, community-focused website designed to provide tools, information, reference data, and planning features related to <strong>Marvel Contest of Champions (MCOC)</strong>.
            </p>
            <p className="bg-amber-950/30 border-l-2 border-brand-yellow p-2.5 text-amber-200 text-[11px]">
              MCOC NEXUS is <strong>not affiliated with, endorsed by, sponsored by, or officially connected with Kabam Games, Inc., Marvel, or any of their respective companies, products, or services</strong>.
            </p>
            <p>
              Marvel Contest of Champions and related characters, names, images, trademarks, and intellectual property belong to their respective owners.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">2.</span> Acceptance of These Terms
            </h4>
            <p>
              By accessing or using MCOC NEXUS, you confirm that you have read, understood, and agree to these Terms of Service and our Privacy Policy.
            </p>
            <p>
              These Terms apply to all visitors, registered users, and anyone who accesses or uses any feature of MCOC NEXUS.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">3.</span> Use of the Website
            </h4>
            <p>You may use MCOC NEXUS for lawful personal and informational purposes.</p>
            <p className="font-semibold text-gray-200">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Use the website for unlawful or fraudulent purposes.</li>
              <li>Attempt to gain unauthorized access to the website, server, database, or accounts.</li>
              <li>Interfere with or disrupt the operation or security of the website.</li>
              <li>Attempt to reverse engineer, exploit, damage, or compromise any part of the service.</li>
              <li>Use automated systems, bots, scrapers, or other methods to abuse or overload the service.</li>
              <li>Upload or submit malicious code, viruses, or harmful content.</li>
              <li>Misuse information or features provided by the website.</li>
              <li>Impersonate another person or entity.</li>
              <li>Use the website in a way that violates applicable laws or regulations.</li>
            </ul>
            <p className="text-gray-400">
              We reserve the right to restrict or terminate access if we believe these rules have been violated.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">4.</span> User Accounts
            </h4>
            <p>Certain features of MCOC NEXUS may require you to create an account.</p>
            <p>When creating an account, you agree to provide information that is accurate and reasonably up to date.</p>
            <p className="font-semibold text-gray-200">You are responsible for:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Maintaining the confidentiality of your account credentials.</li>
              <li>Keeping your password secure.</li>
              <li>All activity performed through your account.</li>
              <li>Informing us if you believe your account has been accessed without authorization.</li>
            </ul>
            <p>
              You must not share your account credentials with others or use another person's account without permission.
            </p>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms or are involved in misuse of the service.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">5.</span> User-Generated and Saved Data
            </h4>
            <p>
              MCOC NEXUS may provide features that allow users to create, save, modify, or manage information such as champion selections, rosters, upgrade plans, preferences, or other content.
            </p>
            <p>You remain responsible for the information you choose to enter or save.</p>
            <p className="font-semibold text-gray-200">You agree not to submit content that:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Is illegal or fraudulent.</li>
              <li>Infringes another person's intellectual property rights.</li>
              <li>Contains malicious software or harmful code.</li>
              <li>Attempts to exploit or compromise the service.</li>
              <li>Contains abusive, threatening, or inappropriate material.</li>
            </ul>
            <p>
              We may remove or restrict content that violates these Terms or creates a risk to the service or its users.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">6.</span> MCOC Data and Game-Related Content
            </h4>
            <p>
              MCOC NEXUS may display information relating to Marvel Contest of Champions, including but not limited to champion names, abilities, classes, ratings, game mechanics, statistics, and other game-related information.
            </p>
            <p>
              Such information is provided for <strong>informational and reference purposes only</strong>.
            </p>
            <p>
              Game information may change over time due to updates, balance changes, patches, new releases, or other changes made by the game's developers.
            </p>
            <p>
              MCOC NEXUS does not guarantee that all game-related information will always be complete, accurate, or current.
            </p>
            <p className="text-green-300 font-semibold">
              MCOC NEXUS does not provide cheats, hacks, exploits, unauthorized game modifications, or methods intended to circumvent game security.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">7.</span> Intellectual Property
            </h4>
            <p>
              The MCOC NEXUS website, including its original design, branding, source code, interface, text, graphics, and original functionality, is protected by applicable intellectual property laws.
            </p>
            <p>
              You may not copy, reproduce, redistribute, modify, sell, or commercially exploit original MCOC NEXUS materials without appropriate permission.
            </p>
            <p>
              Third-party names, trademarks, characters, logos, artwork, game assets, and related intellectual property belong to their respective owners.
            </p>
            <p>
              Nothing in these Terms grants you ownership or rights to third-party intellectual property displayed through the website.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">8.</span> Third-Party Services and Links
            </h4>
            <p>
              MCOC NEXUS may use or link to third-party services, websites, APIs, hosting providers, authentication providers, email services, analytics services, or other external platforms.
            </p>
            <p>
              Third-party services operate independently from MCOC NEXUS and may have their own terms and privacy policies.
            </p>
            <p>
              We are not responsible for the availability, accuracy, security, privacy practices, or content of third-party services.
            </p>
            <p>Your use of third-party services is subject to the terms and policies of those services.</p>
          </section>

          {/* Section 9 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">9.</span> Service Availability
            </h4>
            <p>We aim to keep MCOC NEXUS available and functioning reliably; however, we do not guarantee that the website will always be:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Available without interruption.</li>
              <li>Free from errors or bugs.</li>
              <li>Free from security vulnerabilities.</li>
              <li>Compatible with every device or browser.</li>
              <li>Free from temporary downtime or maintenance.</li>
            </ul>
            <p>We may modify, suspend, discontinue, or restrict any part of the website or its features at any time.</p>
          </section>

          {/* Section 10 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">10.</span> Disclaimer
            </h4>
            <p>
              MCOC NEXUS is provided on an <strong>"as is" and "as available"</strong> basis.
            </p>
            <p>
              To the extent permitted by applicable law, we make no warranties regarding the accuracy, reliability, availability, completeness, or suitability of the website or its information.
            </p>
            <p>
              Game-related information, recommendations, calculations, rankings, and planning tools are intended to assist users and should not be treated as guaranteed results or official game guidance.
            </p>
            <p>You are responsible for evaluating information before relying on it.</p>
          </section>

          {/* Section 11 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">11.</span> Limitation of Liability
            </h4>
            <p>To the maximum extent permitted by applicable law, MCOC NEXUS and its developers, contributors, and operators shall not be liable for any direct, indirect, incidental, consequential, special, or other damages arising from or related to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Your use or inability to use the website.</li>
              <li>Errors or inaccuracies in website information.</li>
              <li>Loss of user data.</li>
              <li>Website downtime or service interruptions.</li>
              <li>Security incidents or unauthorized access.</li>
              <li>Reliance on game-related information or recommendations.</li>
              <li>Third-party services or external websites.</li>
            </ul>
            <p>Nothing in these Terms is intended to exclude liability that cannot legally be excluded under applicable law.</p>
          </section>

          {/* Section 12 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">12.</span> Account Suspension and Termination
            </h4>
            <p>We may suspend, restrict, or terminate your access to MCOC NEXUS at our discretion if:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>You violate these Terms.</li>
              <li>You engage in abusive, fraudulent, or harmful activity.</li>
              <li>You attempt to compromise the security of the service.</li>
              <li>Your activity creates a significant risk to the website or other users.</li>
              <li>Required by law or legal authority.</li>
            </ul>
            <p>You may stop using the service at any time.</p>
            <p>Termination may result in the loss of access to account-related features and saved information associated with your account.</p>
          </section>

          {/* Section 13 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">13.</span> Changes to the Service
            </h4>
            <p>We may add, remove, modify, or update features of MCOC NEXUS at any time.</p>
            <p>Features may change as the website develops, including changes to champion data, planning tools, accounts, databases, or other functionality.</p>
            <p>We are not obligated to maintain any particular feature indefinitely.</p>
          </section>

          {/* Section 14 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">14.</span> Changes to These Terms
            </h4>
            <p>We may update these Terms of Service from time to time.</p>
            <p>When changes are made, the <strong>"Last Updated"</strong> date at the top of this page will be updated.</p>
            <p>Your continued use of MCOC NEXUS after changes are published means that you accept the updated Terms.</p>
            <p>If you do not agree with an updated version of the Terms, you should stop using the website.</p>
          </section>

          {/* Section 15 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">15.</span> Privacy
            </h4>
            <p>
              Your use of MCOC NEXUS is also subject to our <strong>Privacy Policy</strong>, which explains how information may be collected, used, stored, and protected.
            </p>
            <p>Please review the Privacy Policy before using features that require personal information or an account.</p>
          </section>

          {/* Section 16 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">16.</span> Governing Law
            </h4>
            <p>
              These Terms shall be interpreted and applied in accordance with the applicable laws and regulations governing the operation of the service, without limiting any mandatory consumer protections that may apply to you.
            </p>
            <p>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue to apply.</p>
          </section>

          {/* Section 17 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">17.</span> Contact Information
            </h4>
            <p>
              If you have questions, concerns, requests, or feedback regarding these Terms of Service, please contact us through the official contact method provided on the MCOC NEXUS website.
            </p>
            <div className="bg-[#181820] border border-[#2c2c36] p-3 rounded-sm space-y-1 font-mono text-xs text-gray-200">
              <div><strong>Website:</strong> MCOC NEXUS</div>
              <div>
                <strong>Contact:</strong>{' '}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=mcocnexusteam@gmail.com&su=MCOC%20NEXUS%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-yellow hover:underline"
                >
                  mcocnexusteam@gmail.com
                </a>
              </div>
            </div>
          </section>

          {/* Section 18 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-aldrich flex items-center gap-2">
              <span className="text-brand-yellow">18.</span> Entire Agreement
            </h4>
            <p>
              These Terms of Service, together with the MCOC NEXUS Privacy Policy and any additional terms presented for specific features, constitute the agreement between you and MCOC NEXUS regarding your use of the service.
            </p>
            <p>If you have any questions about these Terms, please contact us before using the website.</p>
          </section>

          <div className="pt-4 border-t border-[#25252c] text-center text-[11px] text-gray-400">
            <strong>MCOC NEXUS is an independent fan-made/community project and is not affiliated with, endorsed by, or sponsored by Kabam Games, Inc. or Marvel.</strong>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#25252c] bg-[#0d0d0f] flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-brand-yellow text-brand-dark font-extrabold px-6 py-2 text-xs tracking-wider hover:bg-yellow-300 transition-colors"
          >
            I UNDERSTAND & CLOSE
          </button>
        </div>

      </div>
    </div>
  );
}
