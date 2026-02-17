import Link from 'next/link';
import { Header } from '@/components/Header';
import { ChallengeActions } from '@/components/ChallengeActions';
import { db, COLLECTIONS } from '@/lib/firebase-admin';
import { Plus, Users, Calendar, BookOpen } from 'lucide-react';

async function getChallenges() {
  try {
    const snapshot = await db
      .collection(COLLECTIONS.CHALLENGES)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
}

export default async function ChallengesPage() {
  const challenges = await getChallenges();

  return (
    <div>
      <Header
        title="Challenges"
        subtitle="Gérez les défis de mémorisation"
      />

      <div className="p-6">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="upcoming">À venir</option>
              <option value="completed">Terminé</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Toutes les difficultés</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
          <Link
            href="/dashboard/challenges/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau challenge
          </Link>
        </div>

        {/* Challenges Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Challenge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Versets
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {challenges.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Aucun challenge trouvé.{' '}
                      <Link
                        href="/dashboard/challenges/new"
                        className="text-primary-600 hover:underline"
                      >
                        Créer le premier
                      </Link>
                    </td>
                  </tr>
                ) : (
                  challenges.map((challenge: any) => (
                    <tr key={challenge.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                            <BookOpen className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {challenge.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {challenge.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            challenge.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : challenge.status === 'upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {challenge.status === 'active'
                            ? 'Actif'
                            : challenge.status === 'upcoming'
                              ? 'À venir'
                              : 'Terminé'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                          {challenge.participantsCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          {challenge.duration || '-'} jours
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {challenge.totalVerses || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChallengeActions
                          challengeId={challenge.id}
                          challengeTitle={challenge.title}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
