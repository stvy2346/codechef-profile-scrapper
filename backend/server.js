const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const scrapeData = async (username) => {
    try {
        const response = await axios.get(`https://www.codechef.com/users/${username.trim()}`);
        const data = await response.data;
        const $ = cheerio.load(data);
        const name = $(".user-details-container h1").first().text().trim() || "N/A";
        let institution = "";
        let organization = "";
        institution = $('.user-details-container')
                            .find('label:contains("Institution:")')
                            .next('span')
                            .text()
                            .trim() || "";
        organization = $('.user-details-container')
                            .find('label:contains("Organisation:")')
                            .next('span')
                            .text()
                            .trim() || "";
        
        const affiliation = institution || organization || "N/A";
        
        const country = $('.user-details-container')
                            .find('label:contains("Country:")')
                            .next('span')
                            .text()
                            .trim() || "N/A";
        
        
        const ratingText = $(".rating-number").text().trim();
        const currentRating = ratingText ? parseInt(ratingText) || 0 : 0;

        const stars = $(".rating-star").text().trim() || "Unrated";

        const globalRankText = $(".rating-ranks a").first().text().replace(/\D/g, "");
        const globalRank = globalRankText ? parseInt(globalRankText) || 0 : 0;

        const highestRatingText = $(".rating-header small"). text();
        const highestRating =
            highestRatingText && highestRatingText.match(/\d+/)
            ? parseInt(highestRatingText.match(/\d+/)[0])
            : currentRating;

        let totalSolved = 0;
            $(".problems-solved .content h3").each((_, el) => {
            const match = $(el).text().match(/(\d+)/);
            if (match) totalSolved = parseInt(match[0]);
            });

            if (!totalSolved) {
            const altText = $(".problems-solved, .content")
                .text()
                .match(/Total Problems Solved:\s*([0-9]+)/i);
            if (altText) totalSolved = parseInt(altText[1]);
            }


        
        let totalContests = 0;
            const contestDiv = $('div.contest-participated-count');
            if (contestDiv.length) {
            const bTag = contestDiv.find("b").first();
            if (bTag.length) totalContests = parseInt(bTag.text().trim(), 10);
            }

        let totalLearningPaths = 0;
        let totalPracticePaths = 0;

        const lpSection = $("section.rating-data-section.problems-solved").first();
        if (lpSection.length) {
        const h3Tags = lpSection.find("h3");
        if (h3Tags.length) {
            const learningMatch = $(h3Tags[0]).text().match(/\((\d+)\)/);
            if (learningMatch) totalLearningPaths = parseInt(learningMatch[1], 10);

            if (h3Tags.length > 1) {
            const practiceMatch = $(h3Tags[1]).text().match(/\((\d+)\)/);
            if (practiceMatch) totalPracticePaths = parseInt(practiceMatch[1], 10);
            }
        }
        }


        return ({
            username,
            name,
            affiliation,
            country,
            stars,
            currentRating,
            highestRating,
            globalRank,
            totalSolved,
            totalContests,
            totalLearningPaths,
            totalPracticePaths
        })
    } catch (error) {
        console.error("Scraping Error:",error.message);
        throw new Error(`Failed to scrape codechef ${error.message}`);
    }
}

app.get('/',(req,res)=>{
    res.send("Backend is working");
});

app.get('/health',(req,res)=>{
    res.send("Connection is healthy");
});

app.get('/profile/:username',async (req,res)=>{
    try {
        const username = String(req.params.username || "").trim();
        if(!username) res.status(400).json({error : "Enter a valid username"});
        const profileData = await scrapeData(username);
        res.json(profileData);
    } catch (error) {
        res.status(500).json({error : "Failed to fetch profile", message : error.message});
    }
});

const PORT = 8080;
app.listen(PORT,()=>{
    console.log(`Server running on port : ${PORT}`);
});