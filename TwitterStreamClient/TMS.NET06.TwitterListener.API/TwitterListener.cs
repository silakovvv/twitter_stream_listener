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
        /// 
        /// </summary>
        /// <param name="options"></param>
        /// <param name="endDate"></param>
        /// <param name="mode"></param>
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

        public string GetTweetInFormatJSON(Tweet tweet)
        {
            return appClient.Json.Serialize(tweet);
        }

        public string GetTweetsInFormatJSON(List<Tweet> tweets)
        {
            return appClient.Json.Serialize(tweets);
        }
    }
}
