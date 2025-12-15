import { useProfile } from '../features/auth/hooks'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'

const ProfilePage = () => {
  const { data: profile, isLoading } = useProfile()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 space-y-6 p-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
                <p className="text-xs uppercase tracking-wide text-slate-500">Private</p>
              </div>
              {profile?.avatar && (
                <img
                  src={profile.avatar}
                  alt={`${profile.name ?? 'User'} avatar`}
                  className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                />
              )}
            </div>
            {isLoading ? (
              <p className="text-sm text-slate-500">Loading profile...</p>
            ) : (
              <dl className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-900">Name</dt>
                  <dd>{profile?.name ?? 'Anonymous'}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Email</dt>
                  <dd>{profile?.email ?? 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Role</dt>
                  <dd>{profile?.role ?? 'Member'}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Joined</dt>
                  <dd>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</dd>
                </div>
              </dl>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default ProfilePage
