# Popularity Score

Popularity score is based on video views on YouTube: the total video views of the channel and the median video views of the last 20 videos. There is also a score adjustment for channels that haven't uploaded for longer than 6 months.

```js
const viewCountScore = Math.pow(totalViews, 0.4)
const medianViewScore = Math.pow(medianViews * 2, 0.7)
const timeAdjustment = Math.pow(0.7, halfYearsSinceLastUpload)

const popularityScore = Math.round((viewCountScore + medianViewScore) * timeAdjustment)
```
