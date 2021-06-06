using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tweetinvi;
using Tweetinvi.Core.Models;

namespace TMS.NET06.TwitterListener.API
{
    public class TwitterListener
    {
        private string _consumerKey;
        private string _consumerSecret;
        private string _accessToken;
        private string _accessTokenSecret;

        private TwitterClient appClient;

        public Dictionary<int, List<Tweet>> ListenerTasksTweets { get; set; }
        public Queue<int> ProcessedTasks { get; set; }

        public TwitterListener()
        {
            _consumerKey = SettingsTwitterAPI.Default.ConsumerKey;
            _consumerSecret = SettingsTwitterAPI.Default.ConsumerSecret;
            _accessToken = SettingsTwitterAPI.Default.AccessToken;
            _accessTokenSecret = SettingsTwitterAPI.Default.AccessTokenSecret;

            appClient = new TwitterClient(
                _consumerKey,
                _consumerSecret,
                _accessToken,
                _accessTokenSecret);
        }

        /// <summary>
        /// Get a list of tweets by listening a stream Twitter, leveraging package Twitterinvi.
        /// </summary>
        /// <param name="options">An array of filtering rules. The entire list of rules is available here: 'https://developer.twitter.com/en/docs/twitter-api/enterprise/search-api/overview'</param>
        /// <param name="endDate">Date until which you want to listen to the stream.</param>
        /// <param name="mode">Filtering mode (0 - all; 1 - any).</param>
        /// <returns></returns>
        public async Task<List<Tweet>> ListenStreamInRealTimeAsync(string[] options, DateTime endDate, int mode)
        {
            List<Tweet> Tweets = new List<Tweet>();

            var twitterStream = appClient.Streams.CreateFilteredStream();

            foreach (var option in options)
            {
                twitterStream.AddTrack(option);
            }

            twitterStream.MatchingTweetReceived += (sender, eventReceived) =>
            {
                Tweets.Add((Tweet)eventReceived.Tweet);

                if (DateTime.Now >= endDate)
                {
                    twitterStream.Stop();
                }
            };

            if (mode == 0)
            {
                await twitterStream.StartMatchingAnyConditionAsync();
            }
            else if (mode == 1)
            {
                await twitterStream.StartMatchingAllConditionsAsync();
            }
            else
            {
                return null;
            }

            return Tweets;
        }

        /// <summary>
        /// Get a tweet as string in format JSON.
        /// </summary>
        /// <param name="tweet">Tweet.</param>
        /// <returns></returns>
        public string GetTweetInFormatJSON(Tweet tweet)
        {
            return appClient.Json.Serialize(tweet);
        }

        /// <summary>
        /// Get a list of tweets as string in format JSON.
        /// </summary>
        /// <param name="tweets">A list of tweets.</param>
        /// <returns></returns>
        public string GetTweetsInFormatJSON(List<Tweet> tweets)
        {
            return appClient.Json.Serialize(tweets);
        }
    }
}
