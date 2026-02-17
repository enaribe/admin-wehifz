import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { db, COLLECTIONS } from '@/lib/firebase-admin';
import { Users, BookOpen, Trophy, MessageSquare, TrendingUp, Calendar } from 'lucide-react';

async function getStats() {
  try {
    // Get counts from Firestore
    const [usersSnap, challengesSnap, versesSnap, messagesSnap] = await Promise.all([
      db.collection(COLLECTIONS.USERS).count().get(),
      db.collection(COLLECTIONS.CHALLENGES).count().get(),
      db.collection(COLLECTIONS.VERSES).count().get(),
      db.collection(COLLECTIONS.MESSAGES).count().get(),
    ]);

    // Get active challenges
    const activeChallengesSnap = await db
      .collection(COLLECTIONS.CHALLENGES)
      .where('status', '==', 'active')
      .count()
      .get();

    // Get recent users (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentUsersSnap = await db
      .collection(COLLECTIONS.USERS)
      .where('createdAt', '>=', weekAgo)
      .count()
      .get();

    return {
      totalUsers: usersSnap.data().count,
      totalChallenges: challengesSnap.data().count,
      totalVerses: versesSnap.data().count,
      totalMessages: messagesSnap.data().count,
      activeChallenges: activeChallengesSnap.data().count,
      newUsersThisWeek: recentUsersSnap.data().count,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalUsers: 0,
      totalChallenges: 0,
      totalVerses: 0,
      totalMessages: 0,
      activeChallenges: 0,
      newUsersThisWeek: 0,
    };
  }
}

async function getRecentActivity() {
  try {
    // Get recent users
    const recentUsers = await db
      .collection(COLLECTIONS.USERS)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    // Get recent challenges
    const recentChallenges = await db
      .collection(COLLECTIONS.CHALLENGES)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    return {
      users: recentUsers.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      challenges: recentChallenges.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return { users: [], challenges: [] };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();
  const activity = await getRecentActivity();

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Vue d'ensemble de l'application Wehifz"
      />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Utilisateurs"
            value={stats.totalUsers.toLocaleString()}
            change={`+${stats.newUsersThisWeek} cette semaine`}
            changeType="positive"
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatsCard
            title="Challenges"
            value={stats.totalChallenges}
            change={`${stats.activeChallenges} actifs`}
            changeType="neutral"
            icon={Trophy}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100"
          />
          <StatsCard
            title="Versets importés"
            value={stats.totalVerses.toLocaleString()}
            change={stats.totalVerses === 6236 ? 'Complet' : 'Incomplet'}
            changeType={stats.totalVerses === 6236 ? 'positive' : 'negative'}
            icon={BookOpen}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          <StatsCard
            title="Messages"
            value={stats.totalMessages.toLocaleString()}
            icon={MessageSquare}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Nouveaux utilisateurs
              </h3>
              <a
                href="/dashboard/users"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Voir tout →
              </a>
            </div>
            <div className="space-y-4">
              {activity.users.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucun utilisateur récent
                </p>
              ) : (
                activity.users.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {user.displayName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.displayName || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {user.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || '-'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Challenges */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Challenges récents
              </h3>
              <a
                href="/dashboard/challenges"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Voir tout →
              </a>
            </div>
            <div className="space-y-4">
              {activity.challenges.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucun challenge récent
                </p>
              ) : (
                activity.challenges.map((challenge: any) => (
                  <div
                    key={challenge.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {challenge.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {challenge.participantsCount || 0} participants
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        challenge.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : challenge.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {challenge.status === 'active'
                        ? 'Actif'
                        : challenge.status === 'upcoming'
                          ? 'À venir'
                          : 'Terminé'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="/dashboard/challenges/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              Créer un challenge
            </a>
            <a
              href="/dashboard/import"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Importer des versets
            </a>
            <a
              href="/dashboard/users"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-4 h-4" />
              Gérer les utilisateurs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
