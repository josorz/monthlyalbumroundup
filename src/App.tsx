import { useEffect, useState } from "react";
import { getAccessToken, redirectToAuthCodeFlow } from "./utils";
import axios from "axios";

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const clientId = "3282c62f0e874c96bf95b45ec885b56b";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    async function fetchData() {
      if (!code) {
        redirectToAuthCodeFlow(clientId);
      } else {
        try {
          const accessToken = await getAccessToken(clientId, code);
          const profileData = await fetchProfile(accessToken);
          setProfile(profileData);
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    }

    fetchData();
  }, []);

  async function fetchProfile(token: string): Promise<UserProfile> {
    const { data } = await axios.get<UserProfile>(
      "https://api.spotify.com/v1/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Display your Spotify profile data
      </h1>

      {profile ? (
        <section id="profile" className="space-y-2">
          <h2 className="text-lg font-semibold">
            Logged in as <span>{profile.display_name}</span>
          </h2>
          {profile.images?.length > 0 && (
            <img
              src={profile.images[0].url}
              alt="Avatar"
              className="w-24 h-24 rounded-full"
            />
          )}
          <ul className="list-disc list-inside">
            <li>User ID: {profile.id}</li>
            <li>Email: {profile.email}</li>
            <li>
              Spotify URI:{" "}
              <a
                href={profile.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {profile.uri}
              </a>
            </li>
            <li>
              Link:{" "}
              <a
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {profile.href}
              </a>
            </li>
            <li>Profile Image URL: {profile.images?.[0]?.url}</li>
          </ul>
        </section>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default App;
