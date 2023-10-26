import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin-top: 15rem;
`;

const VideosRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const VideoCard = styled.div`
  width: 360px;
  margin: 0 1rem 2rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;

  iframe {
    width: 100%;
    height: 200px;
  }

  h3 {
    font-size: 1.5rem;
    margin: 1rem 0;
  }

  p {
    font-size: 1rem;
    color: #666;
  }
`;

const LatestVideoCard = styled(VideoCard)`
  width: 60%; /* Full width for the latest video */
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2);
  margin: 0 auto;

  iframe {
    height: 300px; /* Bigger height for the latest video */
  }

  h3 {
    font-size: 2rem; /* Bigger font size for the latest video */
  }
`;

const RecentVideosTitle = styled.h3`
  width: 100%;
  text-align: center;
  margin-bottom: 3rem;
  margin-top: 3rem;
`;



const Videos = () => {
  const [videos, setVideos] = useState([]);
const apiKey = 'AIzaSyCM5i4t6K5wWQyBHnOIKoslbVAocmT6UNY'; // Replace with your YouTube Data API key
  const channelId = 'UC4x0W3Nq8naeKoQ1jPsnpmA'; 
  
    useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log('Fetching YouTube videos...');
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&order=date&part=snippet&type=video&maxResults=10`
        );
        console.log('API Response:', response); // Log the API response
        const data = await response.json();
        console.log('API Data:', data); // Log the parsed data

        if (data.items) {
          console.log('YouTube videos fetched successfully:', data.items);
          setVideos(data.items);
        }
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
      }
    };

    fetchVideos();
  }, [apiKey, channelId]);


    return (
    <StyledContainer>
      {videos.slice(0, 1).map((video) => (
        <>
        <h2>Latest Video</h2>
        <LatestVideoCard key={video.id.videoId}>
          <iframe
            title={video.snippet.title}
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <h3>{video.snippet.title}</h3>
          <p>{video.snippet.description}</p>
        </LatestVideoCard>
        </>
      ))}
        <RecentVideosTitle>Recent Videos</RecentVideosTitle>
      <VideosRow>
        {videos.slice(1).map((video) => (
          <VideoCard key={video.id.videoId}>
            <iframe
              title={video.snippet.title}
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <h3>{video.snippet.title}</h3>
            <p>{video.snippet.description}</p>
          </VideoCard>
        ))}
      </VideosRow>
    </StyledContainer>
  );
};

export default Videos;