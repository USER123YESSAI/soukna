import LegalLayout from '../../components/legal/LegalLayout';
import { ShieldCheck, Lock, Database, UserCheck, KeyRound, Eye, Cookie, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Politique de Confidentialité"
      subtitle="La protection de vos données personnelles est au cœur de nos priorités. Découvrez en toute transparence comment Soukna collecte, utilise et protège vos informations."
      version="1.0"
      lastUpdated="7 septembre 2026"
    >
      <div className="space-y-10 text-slate-700 leading-relaxed">
        {/* Note d'introduction */}
        <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3.5">
          <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={22} />
          <div className="text-sm text-emerald-950">
            <strong className="font-semibold block mb-1">Notre engagement de transparence</strong>
            Soukna applique les principes stricts du Règlement Général sur la Protection des Données (RGPD) et des législations en vigueur relatives à la protection de la vie privée. Nous ne commercialisons en aucun cas vos données personnelles à des tiers.
          </div>
        </div>

        {/* Section 1 : Données collectées */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">1</span>
            Données Personnelles Collectées
          </h2>
          <p className="mb-3">
            Nous ne recueillons que les informations strictement nécessaires au bon fonctionnement de la plateforme :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <UserCheck size={16} className="text-indigo-600" />
                Données de profil & compte
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nom complet, adresse email, mot de passe sécurisé (hashé), numéro de téléphone, ville, photo de profil et rôle utilisateur (acheteur ou vendeur).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <Database size={16} className="text-indigo-600" />
                Données de transaction & commandes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Historique des commandes, adresses de livraison, facturation, produits ajoutés au panier ou aux favoris et messages échangés entre acheteurs et vendeurs.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 : Finalités du traitement */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">2</span>
            Finalités et Bases Légales du Traitement
          </h2>
          <p className="mb-3">
            Vos données personnelles sont traitées pour les finalités suivantes :
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li><strong>Exécution des contrats :</strong> Traitement et suivi des commandes, mise en relation entre acheteurs et vendeurs, notifications relatives aux commandes.</li>
            <li><strong>Gestion de la relation client :</strong> Support technique, messagerie interne, gestion des réclamations et des retours.</li>
            <li><strong>Sécurité de la plateforme :</strong> Prévention de la fraude, détection des abus, journalisation sécurisée des accès et maintien de l'intégrité de la marketplace.</li>
            <li><strong>Conformité légale :</strong> Archivage obligatoire des factures et justificatifs comptables conformément aux dispositions légales.</li>
          </ul>
        </section>

        {/* Section 3 : Partage des données */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">3</span>
            Destinataires et Partage des Données
          </h2>
          <p className="mb-3">
            Vos données sont uniquement transmises aux intervenants autorisés suivants :
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li><strong>Le vendeur concerné :</strong> Uniquement les données requises pour l'expédition de votre commande (nom, téléphone, adresse de livraison).</li>
            <li><strong>Prestataires techniques certifiés :</strong> Hébergement d'infrastructure, gestion sécurisée des bases de données et services d'envoi d'emails transactionnels.</li>
            <li><strong>Autorités administratives ou judiciaires :</strong> Uniquement lorsque la loi l'exige expressément.</li>
          </ul>
        </section>

        {/* Section 4 : Sécurité & Chiffrement */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">4</span>
            Sécurité et Conservation des Données
          </h2>
          <div className="space-y-3">
            <p>
              Soukna met en œuvre des mesures techniques et organisationnelles rigoureuses pour garantir la sécurité et la confidentialité de vos données :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                  <Lock size={16} className="text-emerald-600" />
                  Chiffrement SSL / HTTPS
                </div>
                <p className="text-xs text-slate-600">
                  L'ensemble des communications et échanges sur la plateforme sont systématiquement chiffrés de bout en bout via le protocole SSL/TLS.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                  <KeyRound size={16} className="text-indigo-600" />
                  Hachage des mots de passe
                </div>
                <p className="text-xs text-slate-600">
                  Vos mots de passe ne sont jamais stockés en clair. Ils sont irréversiblement chiffrés à l'aide d'algorithmes de hachage industriels (Bcrypt).
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 pt-2">
              Les données de compte sont conservées pendant toute la durée d'activité du compte. En cas d'inactivité prolongée (3 ans) ou sur simple demande, elles sont anonymisées ou supprimées.
            </p>
          </div>
        </section>

        {/* Section 5 : Vos droits */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">5</span>
            Vos Droits sur Vos Données
          </h2>
          <p className="mb-3">
            Conformément à la réglementation applicable, vous disposez des droits suivants à tout moment :
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li><strong>Droit d'accès :</strong> Obtenir la confirmation que vos données sont traitées et en obtenir une copie.</li>
            <li><strong>Droit de rectification :</strong> Corriger ou mettre à jour directement vos informations depuis votre espace profil.</li>
            <li><strong>Droit à l'effacement :</strong> Demander la suppression de votre compte et des données associées.</li>
            <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré et lisible par machine.</li>
            <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données pour des motifs légitimes.</li>
          </ul>
        </section>

        {/* Section 6 : Cookies */}
        <section className="border-b border-slate-100 pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">6</span>
            Cookies et Stockage Local
          </h2>
          <p className="mb-3">
            Soukna utilise des identifiants de session et le stockage local de votre navigateur uniquement pour vous maintenir connecté et conserver temporairement vos préférences (panier, filtres de recherche). Nous n'utilisons aucun traceur publicitaire intrusif tiers.
          </p>
        </section>

        {/* Section 7 : Contact */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">7</span>
            Contact et Délégué à la Protection des Données
          </h2>
          <p className="mb-2">
            Pour exercer vos droits ou pour toute question concernant la gestion de vos données personnelles, vous pouvez écrire à notre équipe dédiée :
          </p>
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1">
            <p className="flex items-center gap-2 font-medium text-slate-900">
              <Mail size={16} className="text-indigo-600" />
              dpo@soukna.com (ou privacy@soukna.com)
            </p>
            <p className="text-slate-600">Réponse garantie sous un délai maximal de 30 jours.</p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
