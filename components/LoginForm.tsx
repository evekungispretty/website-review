'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Chrome, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function LoginForm() {
  const { signInWithGoogle, signInDemo, loading, error, isDemoMode, user } = useAuth();

  const isConfigError = error?.includes('redirect') || error?.includes('localhost') || error?.includes('OAuth Configuration');

  // Debug info - remove this in production
  const debugInfo = {
    hasUser: !!user,
    userEmail: user?.email,
    loading,
    error,
    isDemoMode,
  };

  console.log('🔐 LoginForm render:', debugInfo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">Welcome to Website Reviewer</CardTitle>
          <CardDescription>
           Sign in to start reviewing websites and collaborating with your team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <details className="text-xs">
                  <summary>Debug Info (dev only)</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant={isConfigError ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {isConfigError ? (
                  <div className="space-y-2">
                    <p className="font-medium">OAuth Configuration Issue</p>
                    <p className="text-sm">
                      The redirect is going to localhost instead of your domain. 
                      Please update your Supabase Site URL settings:
                    </p>
                    <ol className="text-sm list-decimal list-inside space-y-1 ml-2">
                      <li>Go to Supabase Dashboard → Authentication → Settings</li>
                      <li>Set Site URL to: <code className="bg-muted px-1 rounded">https://review.evekung.com</code></li>
                      <li>Add to Redirect URLs: <code className="bg-muted px-1 rounded">https://review.evekung.com/**</code></li>
                      <li>Save the configuration</li>
                    </ol>
                  </div>
                ) : (
                  error
                )}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            {!isDemoMode && (
              <Button 
                onClick={signInWithGoogle} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Chrome className="mr-2 h-4 w-4" />
                    Continue with Google
                  </>
                )}
              </Button>
            )}
            
            <Button 
              onClick={signInDemo} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              Try Demo Mode
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo mode lets you test the app without authentication</p>
            {isDemoMode && (
              <p className="mt-2 text-amber-600">
                ⚠️ Demo mode active - Configure Supabase for full functionality
              </p>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            <h4 className="font-medium mb-2">Features you'll get:</h4>
            <ul className="space-y-1 text-xs">
              <li>• Add comments to any website</li>
              <li>• Collaborate with team members</li>
              <li>• Sync across all your devices</li>
              <li>• Real-time updates and notifications</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}