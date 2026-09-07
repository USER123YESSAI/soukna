import LegalLayout from '../../components/legal/LegalLayout';
import { Scale, ShieldAlert, ShoppingBag, Truck, RefreshCw, UserCheck, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      subtitle="Bienvenue sur Soukna. Veuillez lire attentivement les présentes conditions avant d'utiliser notre plateforme de marketplace."
      version="1.0"
      lastUpdated="7 septembre 2026"
    >
      <div className="space-y-10 text-slate-700 leading-relaxed">
        {/* Note d'introduction */}
        <div className="p-4 sm:p-5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3.5">
          <Scale className="text-indigo-600 shrink-0 mt-0.5" size={22} />
          <div className="text-sm text-indigo-950">
            <strong className="font-semibold block mb-1">Résumé en clair</strong>
            En accédant ou en créant un compte sur Soukna, vous confirmez avoir lu, compris et accepté sans réserve les présentes Conditions Générales d'Utilisation (CGU). Celles-ci encadrent vos droits et devoirs en tant qu'acheteur, vendeur ou visiteur de la plateforme.
          </div>
        </div>

        {/* Section 1 : Définitions et Objet */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">1</span>
            Objet et Définitions
          </h2>
          <p className="mb-3">
            La plateforme <strong>Soukna</strong> est un service numérique de marketplace mettant en relation directe des vendeurs professionnels ou indépendants et des acheteurs pour la vente de produits neufs ou reconditionnés.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li><strong>Plateforme :</strong> Le site web, les applications et les services associés de Soukna.</li>
            <li><strong>Utilisateur :</strong> Toute personne physique ou morale naviguant ou utilisant les services du site.</li>
            <li><strong>Acheteur :</strong> Tout utilisateur effectuant un achat ou passant commande sur la plateforme.</li>
            <li><strong>Vendeur :</strong> Tout utilisateur disposant d'un compte vendeur validé et publiant des annonces de produits.</li>
          </ul>
        </section>

        {/* Section 2 : Inscription et Compte */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">2</span>
            Création de Compte et Sécurité
          </h2>
          <div className="space-y-3">
            <p>
              Pour accéder aux fonctionnalités transactionnelles (passer une commande, publier des produits, échanger des messages), l'utilisateur doit obligatoirement créer un compte.
            </p>
            <p>
              L'utilisateur s'engage à fournir des informations véridiques, complètes et à jour lors de son inscription. Il est seul responsable du maintien de la confidentialité de son mot de passe et de toute activité effectuée sous ses identifiants.
            </p>
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Obligation d'acceptation :</strong> L'acceptation expresse des présentes Conditions d'utilisation et de la Politique de confidentialité est obligatoire pour finaliser l'inscription. Tout compte créé implique une pleine adhésion sans réserve.
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 : Engagements des Vendeurs */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">3</span>
            Règles et Obligations des Vendeurs
          </h2>
          <p className="mb-3">
            Chaque vendeur s'engage à respecter les lois en vigueur et les standards d'excellence de Soukna :
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li><strong>Conformité des produits :</strong> Les articles proposés doivent être légaux, authentiques (interdiction formelle de contrefaçons), en stock ou approvisionnables rapidement.</li>
            <li><strong>Descriptions fidèles :</strong> Les photos, prix, descriptions, caractéristiques et états (neuf, excellent état, etc.) doivent correspondre scrupuleusement à la réalité.</li>
            <li><strong>Gestion des commandes :</strong> Le vendeur s'engage à préparer et expédier les commandes dans les délais annoncés et à communiquer les informations de suivi à l'acheteur.</li>
            <li><strong>Transparence des tarifs :</strong> Tous les prix affichés doivent inclure les taxes obligatoires applicables.</li>
          </ul>
        </section>

        {/* Section 4 : Engagements des Acheteurs & Commandes */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">4</span>
            Commandes et Engagements des Acheteurs
          </h2>
          <div className="space-y-3">
            <p>
              Toute commande passée sur la plateforme constitue un engagement ferme d'achat de la part de l'acheteur une fois validée.
            </p>
            <p>
              L'acheteur s'engage à régler le montant total de la commande selon les moyens de paiement autorisés sur la plateforme et à fournir une adresse de livraison exacte et complète.
            </p>
          </div>
        </section>

        {/* Section 5 : Avis, Notes et Modération */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">5</span>
            Avis Clients et Système d'Évaluation
          </h2>
          <p className="mb-3">
            Les utilisateurs peuvent évaluer et commenter leurs transactions. Les avis doivent refléter une expérience réelle, être objectifs, courtois et dépourvus de propos diffamatoires, discriminatoires ou agressifs.
          </p>
          <p>
            Soukna se réserve le droit de modérer ou supprimer sans préavis tout avis ne respectant pas cette charte.
          </p>
        </section>

        {/* Section 6 : Suspension et Résiliation */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">6</span>
            Suspension et Clôture de Compte
          </h2>
          <p className="mb-3">
            En cas de non-respect avéré des présentes CGU (fraude, défaut répété de livraison, vente d'articles prohibés, comportement abusif envers les utilisateurs), Soukna se réserve le droit de :
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>Suspendre temporairement l'accès aux services et au compte utilisateur ;</li>
            <li>Masquer ou supprimer les annonces concernées ;</li>
            <li>Résilier définitivement le compte utilisateur sans indemnité.</li>
          </ul>
        </section>

        {/* Section 7 : Évolution des Conditions */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">7</span>
            Mise à jour des Conditions d'Utilisation
          </h2>
          <p className="mb-3">
            Soukna se réserve le droit de modifier les présentes CGU pour se conformer aux évolutions réglementaires ou techniques. En cas de révision substantielle, les utilisateurs seront invités à accepter la nouvelle version lors de leur connexion ou sur leur espace client.
          </p>
        </section>

        {/* Section 8 : Contact et Réclamations */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">8</span>
            Assistance et Contact
          </h2>
          <p className="mb-2">
            Pour toute question ou réclamation relative aux présentes Conditions Générales d'Utilisation, vous pouvez contacter notre équipe support :
          </p>
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1">
            <p><strong>Support Soukna :</strong> legal@soukna.com</p>
            <p><strong>Plateforme :</strong> Soukna Marketplace</p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
