import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Input, 
  Tab, 
  Tabs,
  Avatar,
  Chip,
  Divider,
  Switch
} from '@nextui-org/react';
import { 
  User, 
  Mail, 
  Shield, 
  CreditCard, 
  Settings, 
  Key,
  Bell,
  Globe,
  Palette
} from 'lucide-react';

const Profile = () => {
  const { user, hasProAccess } = useAuth();
  const [selectedTab, setSelectedTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  const getUserInitials = (username: string) => {
    return username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-center gap-6">
          <Avatar
            size="lg"
            name={getUserInitials(user?.username || '')}
            className="w-20 h-20 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{user?.username}</h1>
            <p className="text-gray-400 mb-3">{user?.email}</p>
            <div className="flex items-center gap-3">
              <Chip
                color={hasProAccess() ? "primary" : "default"}
                variant="flat"
                startContent={<CreditCard className="w-4 h-4" />}
              >
                {user?.subscription?.plan_display_name || 'Free Plan'}
              </Chip>
              <Chip
                color={user?.subscription?.status === 'active' ? "success" : "warning"}
                variant="flat"
              >
                {user?.subscription?.status || 'Inactive'}
              </Chip>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="card">
        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key as string)}
          aria-label="Profile options"
          className="p-4"
          classNames={{
            tabList: "bg-gray-800/50 rounded-lg p-1 gap-1",
            cursor: "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg rounded-md",
            tab: "px-6 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 rounded-md",
            tabContent: "group-data-[selected=true]:text-white"
          }}
        >
          {/* Personal Information Tab */}
          <Tab 
            key="personal" 
            title={
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Info
              </div>
            }
          >
            <div className="mt-6 space-y-6">
              <Card className="glass">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                    {!isEditing ? (
                      <Button
                        size="sm"
                        color="primary"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          onClick={handleSaveProfile}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="ghost"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Username</label>
                      <Input
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        startContent={<User className="w-4 h-4 text-gray-400" />}
                        isReadOnly={!isEditing}
                        variant={isEditing ? "bordered" : "flat"}
                        classNames={{
                          input: "text-white placeholder:text-gray-400",
                          inputWrapper: isEditing ? "border-gray-600 bg-gray-800/50" : "bg-gray-800/30"
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Email Address</label>
                      <Input
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        startContent={<Mail className="w-4 h-4 text-gray-400" />}
                        isReadOnly={!isEditing}
                        variant={isEditing ? "bordered" : "flat"}
                        type="email"
                        classNames={{
                          input: "text-white placeholder:text-gray-400",
                          inputWrapper: isEditing ? "border-gray-600 bg-gray-800/50" : "bg-gray-800/30"
                        }}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* Account Security Tab */}
          <Tab 
            key="security" 
            title={
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </div>
            }
          >
            <div className="mt-6 space-y-6">
              <Card className="glass">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-white">Account Security</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">Password</p>
                        <p className="text-sm text-gray-400">Last updated 30 days ago</p>
                      </div>
                    </div>
                    <Button color="primary" variant="flat" size="sm">
                      Change Password
                    </Button>
                  </div>
                  <Divider className="bg-gray-700" />
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-400">Not enabled</p>
                      </div>
                    </div>
                    <Button color="success" variant="flat" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* Subscription Tab */}
          <Tab 
            key="subscription" 
            title={
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Subscription
              </div>
            }
          >
            <div className="mt-6 space-y-6">
              <Card className="glass">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-white">Subscription Details</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Current Plan</span>
                        <Chip
                          color={hasProAccess() ? "primary" : "default"}
                          variant="flat"
                        >
                          {user?.subscription?.plan_display_name || 'Free Plan'}
                        </Chip>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Status</span>
                        <Chip
                          color={user?.subscription?.status === 'active' ? "success" : "warning"}
                          variant="flat"
                        >
                          {user?.subscription?.status || 'Inactive'}
                        </Chip>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Pro Access</span>
                        <Chip
                          color={hasProAccess() ? "success" : "default"}
                          variant="flat"
                        >
                          {hasProAccess() ? 'Active' : 'Not Active'}
                        </Chip>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      {!hasProAccess() && (
                        <Button 
                          color="primary" 
                          size="lg"
                          className="btn-primary"
                        >
                          Upgrade to Pro
                        </Button>
                      )}
                      {hasProAccess() && (
                        <Button 
                          color="primary" 
                          variant="flat"
                          size="lg"
                          className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white font-medium"
                        >
                          Manage Subscription
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* Preferences Tab */}
          <Tab 
            key="preferences" 
            title={
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Preferences
              </div>
            }
          >
            <div className="mt-6 space-y-6">
              <Card className="glass">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-white">Notification Preferences</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">Email Notifications</p>
                        <p className="text-sm text-gray-400">Receive updates about your account</p>
                      </div>
                    </div>
                    <Switch defaultSelected />
                  </div>
                  <Divider className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Market Updates</p>
                        <p className="text-sm text-gray-400">Get notified about market changes</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <Divider className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">Trading Alerts</p>
                        <p className="text-sm text-gray-400">Alerts for trading opportunities</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
