import { Users, UserPlus, Mail, Video } from 'lucide-react';
import { useState } from 'react';

interface CollaborationPageProps {
  onNavigate?: (section: string) => void;
}

export function CollaborationPage({ onNavigate }: CollaborationPageProps) {
  const [activeTab, setActiveTab] = useState<'team' | 'videos'>('team');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const team = [
    { id: 1, name: 'You', email: 'creator@example.com', role: 'Owner', avatar: 'C', status: 'active', color: '#0A84FF' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Editor', avatar: 'S', status: 'active', color: '#30D158' },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'Viewer', avatar: 'M', status: 'pending', color: '#FFD60A' },
  ];

  const videos = [
    { id: 1, title: 'YouTube Vlog #24', assignedTo: [1, 2], lastUpdated: '2 hours ago' },
    { id: 2, title: 'Product Review', assignedTo: [1], lastUpdated: '1 day ago' },
    { id: 3, title: 'Tutorial Series EP3', assignedTo: [1, 2, 3], lastUpdated: '2 days ago' },
    { id: 4, title: 'Behind the Scenes', assignedTo: [1], lastUpdated: '1 week ago' },
  ];

  const invites = [
    { email: 'alex@example.com', role: 'Editor', sent: '2 days ago', status: 'pending' },
  ];

  const getTeamMember = (id: number) => team.find(m => m.id === id);

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#070707' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
          >
            Collaboration
          </h1>
          <p className="text-sm" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
            Manage your team and project access
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(10,132,255,0.3)]"
          style={{
            backgroundColor: '#0A84FF',
            color: 'white',
            fontFamily: 'Syne, sans-serif'
          }}
        >
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

      {/* Upgrade Notice for Free Plan */}
      <div
        className="p-5 rounded-xl border mb-8 flex items-start gap-4"
        style={{
          backgroundColor: 'rgba(255, 214, 10, 0.05)',
          borderColor: 'rgba(255, 214, 10, 0.2)'
        }}
      >
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(255, 214, 10, 0.15)' }}
        >
          <Users size={20} style={{ color: '#FFD60A' }} />
        </div>
        <div className="flex-1">
          <h3 
            className="text-sm font-bold mb-1"
            style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
          >
            Team Collaboration is a Pro Feature
          </h3>
          <p 
            className="text-xs mb-3"
            style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
          >
            Upgrade to Pro or Agency to invite team members and collaborate on videos together.
          </p>
          <button
            onClick={() => onNavigate?.('upgrade')}
            className="px-4 py-2 rounded-lg text-xs font-semibold"
            style={{
              backgroundColor: '#FFD60A',
              color: '#000',
              fontFamily: 'Syne, sans-serif'
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg inline-flex" style={{ backgroundColor: '#0E0E0E' }}>
        <button
          onClick={() => setActiveTab('team')}
          className="px-4 py-2 rounded text-sm font-medium transition-all"
          style={{
            backgroundColor: activeTab === 'team' ? '#0A84FF' : 'transparent',
            color: activeTab === 'team' ? 'white' : '#666',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          Team Members
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className="px-4 py-2 rounded text-sm font-medium transition-all"
          style={{
            backgroundColor: activeTab === 'videos' ? '#0A84FF' : 'transparent',
            color: activeTab === 'videos' ? 'white' : '#666',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          Video Access
        </button>
      </div>

      {/* Team Members Tab */}
      {activeTab === 'team' && (
        <>
          <div className="mb-8">
            <h2 
              className="text-base font-bold mb-4"
              style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
            >
              Team Members
            </h2>
            <div className="space-y-3">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-lg border flex items-center justify-between"
                  style={{
                    backgroundColor: '#0E0E0E',
                    borderColor: '#1A1A1A'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-sm font-semibold"
                          style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {member.name}
                        </span>
                        {member.status === 'pending' && (
                          <span 
                            className="px-2 py-0.5 rounded-full text-[10px]"
                            style={{
                              backgroundColor: 'rgba(255, 214, 10, 0.15)',
                              color: '#FFD60A',
                              fontFamily: 'DM Sans, sans-serif'
                            }}
                          >
                            Pending
                          </span>
                        )}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      disabled={member.role === 'Owner'}
                      defaultValue={member.role}
                      className="px-3 py-1.5 rounded text-xs border"
                      style={{
                        backgroundColor: '#0A0A0A',
                        borderColor: '#1A1A1A',
                        color: member.role === 'Owner' ? '#666' : 'white',
                        fontFamily: 'DM Sans, sans-serif'
                      }}
                    >
                      <option>Owner</option>
                      <option>Editor</option>
                      <option>Viewer</option>
                    </select>
                    {member.role !== 'Owner' && (
                      <button
                        className="text-xs hover:text-[#FF3B30]"
                        style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Invites */}
          {invites.length > 0 && (
            <div>
              <h2 
                className="text-base font-bold mb-4"
                style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
              >
                Pending Invites
              </h2>
              <div className="space-y-3">
                {invites.map((invite, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border flex items-center justify-between"
                    style={{
                      backgroundColor: '#0E0E0E',
                      borderColor: '#1A1A1A'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#1A1A1A' }}
                      >
                        <Mail size={16} style={{ color: '#666' }} />
                      </div>
                      <div>
                        <div 
                          className="text-sm font-semibold"
                          style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {invite.email}
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Invited {invite.sent} as {invite.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="px-3 py-1.5 rounded text-xs"
                        style={{
                          backgroundColor: '#1A1A1A',
                          color: '#0A84FF',
                          fontFamily: 'DM Sans, sans-serif'
                        }}
                      >
                        Resend
                      </button>
                      <button
                        className="text-xs hover:text-[#FF3B30]"
                        style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Video Access Tab */}
      {activeTab === 'videos' && (
        <div>
          <h2 
            className="text-base font-bold mb-4"
            style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
          >
            Video Access Control
          </h2>
          <div className="space-y-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: '#0E0E0E',
                  borderColor: '#1A1A1A'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#1A1A1A' }}
                    >
                      <Video size={18} style={{ color: '#0A84FF' }} />
                    </div>
                    <div>
                      <div 
                        className="text-sm font-semibold"
                        style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {video.title}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                      >
                        Last updated {video.lastUpdated}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedVideo(video.title);
                      setShowAssignModal(true);
                    }}
                    className="px-3 py-1.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: '#1A1A1A',
                      color: '#0A84FF',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    Manage Access
                  </button>
                </div>

                {/* Assigned Members */}
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xs"
                    style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Access:
                  </span>
                  <div className="flex -space-x-2">
                    {video.assignedTo.map((memberId) => {
                      const member = getTeamMember(memberId);
                      if (!member) return null;
                      return (
                        <div
                          key={memberId}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold border-2"
                          style={{ 
                            backgroundColor: member.color,
                            borderColor: '#0E0E0E'
                          }}
                          title={member.name}
                        >
                          {member.avatar}
                        </div>
                      );
                    })}
                  </div>
                  <span 
                    className="text-xs ml-1"
                    style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {video.assignedTo.length} {video.assignedTo.length === 1 ? 'person' : 'people'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setShowInviteModal(false)}
        >
          <div 
            className="rounded-2xl border max-w-md w-full p-6"
            style={{
              backgroundColor: '#0E0E0E',
              borderColor: '#1A1A1A'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 
              className="text-xl font-bold mb-4"
              style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
            >
              Invite Team Member
            </h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label 
                  className="text-xs block mb-2"
                  style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  className="w-full px-4 py-3 rounded-lg border bg-transparent text-white text-sm outline-none"
                  style={{
                    backgroundColor: '#070707',
                    borderColor: '#1A1A1A',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                />
              </div>

              <div>
                <label 
                  className="text-xs block mb-2"
                  style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Role
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border bg-transparent text-white text-sm outline-none"
                  style={{
                    backgroundColor: '#070707',
                    borderColor: '#1A1A1A',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                >
                  <option value="viewer">Viewer - Can view videos only</option>
                  <option value="editor">Editor - Can edit and export</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-lg font-semibold text-sm border transition-all"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#1A1A1A',
                  color: '#AAA',
                  fontFamily: 'Syne, sans-serif'
                }}
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all"
                style={{
                  backgroundColor: '#0A84FF',
                  color: 'white',
                  fontFamily: 'Syne, sans-serif'
                }}
                onClick={() => setShowInviteModal(false)}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign to Video Modal */}
      {showAssignModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setShowAssignModal(false)}
        >
          <div 
            className="rounded-2xl border max-w-md w-full p-6"
            style={{
              backgroundColor: '#0E0E0E',
              borderColor: '#1A1A1A'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
            >
              Manage Video Access
            </h2>
            <p 
              className="text-sm mb-6"
              style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
            >
              {selectedVideo}
            </p>
            
            <div className="space-y-3 mb-6">
              {team.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:border-[#0A84FF] transition-all"
                  style={{
                    backgroundColor: '#070707',
                    borderColor: '#1A1A1A'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <div 
                        className="text-sm font-medium"
                        style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {member.name}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {member.role}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={member.id === 1}
                    disabled={member.id === 1}
                    className="w-4 h-4"
                  />
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-lg font-semibold text-sm border transition-all"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#1A1A1A',
                  color: '#AAA',
                  fontFamily: 'Syne, sans-serif'
                }}
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all"
                style={{
                  backgroundColor: '#0A84FF',
                  color: 'white',
                  fontFamily: 'Syne, sans-serif'
                }}
                onClick={() => setShowAssignModal(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
