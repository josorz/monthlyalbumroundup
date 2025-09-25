# Monthly Album Roundup

![Demo](https://imgur.com/a/YkaDPoc)

Generate a monthly roundup image of your most listened-to albums using the Spotify API.

## Features

- Infers top albums listened to over the past month
- Generates a PNG collage of album covers (transparent for IG stories)
- Manually add albums using Spotify search API
- Show liked albums and highlight **top 3**

## How albums are selected

Spotify doesn’t directly provide "top albums," so they are inferred from:

- **Recently played songs** - last 50 songs from track history
- **Top songs** - 2+ songs from an album in top tracks, or artist in top 15
- **Top artists** - albums by top artists with no top song are displayed
