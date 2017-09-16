import {
  TaskType,
  TaskSubtype
} from './scorecard.types';

export const studyFormat = {
  "studies": [
    {
      "version": "1.0",
      "title": "Experience Scorecard",
      "experienceList": [
        {
          "name": "Search / Navigation",
          "summary": "Search and navigation experiences are robust in both browsers. The scenario around checking the weather got lower scores for Edge because of the inclusion of the Weather Channel app in the default Top Sites on the New Tab Page.",
          "insights": [

          ],
        },
        {
          "name": "Tab Management",
          "summary": "Tab management is an area where Edge received significantly lower scores than Chrome. Both reordering tabs in a window and moving them to a new window were more difficult and less desirable in Edge. Closing tabs was extremely easy in both browsers, although Edge got slightly dinged for including a warning before closing all tabs, which was seen by some users as unnecessary.",
          "insights": [
            "Tab management is the one area where Chrome's experience was clearly far better than ours. We need to explore what we can do, both in terms of design and performance, to make this a better experience for users.",
          ],
        },
        {
          "name": "Favorites",
          "summary": "Favorites and Bookmarks were highly usable in both Edge and Chrome. However, Favorites in Edge got a lower percentage of positive ratings for desirability, driven by comments that the Favorites UI felt old and complicated.",
          "insights": [
            "Favorites in Edge were highly usable, but on average were seen as less desirable than Bookmarks in Chrome. We should explore what changes we could make Favorites feel more modern without negatively impacting usability.",
          ],
        },
        {
          "name": "New Tab Page",
          "summary": "Experiences on the New Tab Page were generally seen as highly usable. Finding news on the NTP was seen significantly more desirable in Edge, but also got low ratings for usefulness across both browsers.",
          "insights": [
            "Although participants thought the Newsfeed on the NTP was novel, they gave this scenario very low ratings on Usefulness. We should continue to explore other options for the NTP, such as allowing users to customize the feed or simply using the Bing homepage.",
            "Having app installation links on the NTP by default negatively impacted impressions of the predictability of the NTP, and served as a dead end for users pursuing common tasks (like checking the weather). We should evaluate whether this negative UX impact is worth the extra installs.",
          ],
        },
        {
          "name": "Appearance",
          "summary": "Chrome's icon and layout were significantly more desirable than Edge's, driven by participants who felt the design was creative and professional. However, Edge's menu design was more desirable than Chrome's, driven by users who felt it was professional and calm.",
          "insights": [
            "Chrome beats Edge on desirability in some (but not all) areas of Appearance and Personality -- specifically the Icon and Layout of the browser. We need to explore this as part of the larger Edge branding question for RS4/RS5.",
          ],
        },
      ],
      "groups": [
        {
          "title": "groupA",
          "tasks": [
            {
              "id": "Task 1",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "First thing is to get connected to the remote PC.  There are a few steps:",
                "",
                "  1. A website will open, asking for the project name.  Enter \"JuneBrowser\" and submit.",
                "  2. A remote desktop file with a name similar to \"CUE-Browser00_...rdp\" will download.  Open or Run this file. It should launch in Remote Desktop Connection (built into Windows 10.)",
                "  3. You will be prompted to accept an 'unknown connection' to the remote PC.  Don't worry, this is a one-way connection that won't affect your home PC at all. ",
                "  4. When prompted to login, use this password: CUEpassword1",
                "",
                "Click 'Next' once you are connected and signed in (you will be able to see a background of a blue Windows logo.)"
              ],
              "experience": null,
              "feature": null,
            }, {
              "id": "Task 2",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Now that you are logged into the remote PC, go ahead and open up the Edge web browser."
              ],
              "experience": null,
              "feature": null,
            }, {
              "id": "Task 3",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Visit a lasagna recipe site from your Bookmarks.",
              ],
              "experience": "Favorites",
              "feature": "Visit an existing Favorite",
            }, {
              "id": "Task 4",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully visit the site about lasagna?"
              ],
              "dimension": "Accessible",
              "experience": "Favorites",
              "feature": "Visit an existing Favorite",
            }, {
              "id": "Task 5",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to visit a bookmarked site was..."
              ],
              "dimension": "Ease",
              "experience": "Favorites",
              "feature": "Visit an existing Favorite",
            }, {
              "id": "Task 6",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "Finding the lasagna recipe bookmark was easy."
              ],
              "dimension": "Findable",
              "experience": "Favorites",
              "feature": "Visit an existing Favorite",
            }, {
              "id": "Task 7",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once found, navigating to a bookmarked site was easy to do."
              ],
              "dimension": "Usable",
              "experience": "Favorites",
              "feature": "Visit an existing Favorite",
            }, {
              "id": "Task 8",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Navigating to a bookmarked site worked the way I expected."
              ],
              "dimension": "Predictable",
              "experience": "Favorites",
              "feature": "Visit an existing Favorite",
            }, {
              "id": "Task 9",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to navigate to a bookmarked site is important to me."
              ],
              "dimension": "Useful",
              "experience": "Favorites",
              "feature": "Visit an existing Favorite",
            }, {
              "id": "Task 10",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of opening a bookmark in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "Favorites",
              "feature": "Visit an existing Favorite",
            }, {
              "id": "Task 11",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with opening a bookmarked site in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Favorites",
              "feature": "Visit an existing Favorite",
            }, {
              "id": "Task 12",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Favorites",
              "feature": "Visit an existing Favorite",
            }, {
              "id": "Task 13",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Open all the sites in the Bookmarks folder called \"Interesting Animals\" so that each one is in a different tab. (There should be five total.)",
              ],
              "experience": "Tab Management",
              "feature": "Open sites in multiple tabs",
            }, {
              "id": "Task 14",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Task 2 of 8:",
                "Open all the sites in the Bookmarks folder called \"Interesting Animals\" so that each one is in a different tab. (There should be five total.)",
                "",
                "If you have any difficulty seeing UI or content in the browser, you may click the 'pin' icon on the remote desktop toolbar to hide it, or move the UserTesting task widget."
              ],
              "dimension": "Accessible",
              "experience": "Tab Management",
              "feature": "Open sites in multiple tabs",
            }, {
              "id": "Task 15",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to do this was..."
              ],
              "dimension": "Ease",
              "experience": "Tab Management",
              "feature": "Open sites in multiple tabs",
            }, {
              "id": "Task 16",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to open all the bookmarks in new tabs was easy."
              ],
              "dimension": "Findable",
              "experience": "Tab Management",
              "feature": "Open sites in multiple tabs",
            }, {
              "id": "Task 17",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once found, opening all the bookmarks in new tabs was easy to do."
              ],
              "dimension": "Usable",
              "experience": "Tab Management",
              "feature": "Open sites in multiple tabs",
            }, {
              "id": "Task 18",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Opening the bookmarks in new tabs worked the way I expected."
              ],
              "dimension": "Predictable",
              "experience": "Tab Management",
              "feature": "Open sites in multiple tabs",
            }, {
              "id": "Task 19",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to open bookmarks in new tabs is important to me."
              ],
              "dimension": "Useful",
              "experience": "Tab Management",
              "feature": "Open sites in multiple tabs",
            }, {
              "id": "Task 20",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of opening bookmarks in new tabs in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "Tab Management",
              "feature": "Open sites in multiple tabs",
            }, {
              "id": "Task 21",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with opening bookmarks in new tabs in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Tab Management",
              "feature": "Open sites in multiple tabs",
            }, {
              "id": "Task 22",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Tab Management",
              "feature": "Open sites in multiple tabs",
            }, {
              "id": "Task 23",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Change the order of the tabs in the browser so that they are in reverse alphabetical order (Z to A).",
              ],
              "experience": "Tab Management",
              "feature": "Re-order tabs",
            }, {
              "id": "Task 24",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully change the order of the tabs?"
              ],
              "dimension": "Accessible",
              "experience": "Tab Management",
              "feature": "Re-order tabs",
            }, {
              "id": "Task 25",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to change the order of the tabs was..."
              ],
              "dimension": "Ease",
              "experience": "Tab Management",
              "feature": "Re-order tabs",
            }, {
              "id": "Task 26",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to change the order of the tabs was easy."
              ],
              "dimension": "Findable",
              "experience": "Tab Management",
              "feature": "Re-order tabs",
            }, {
              "id": "Task 27",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once found, changing the order of the tabs was easy to do."
              ],
              "dimension": "Usable",
              "experience": "Tab Management",
              "feature": "Re-order tabs",
            }, {
              "id": "Task 28",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Changing the order of the tabs worked the way that I expected."
              ],
              "dimension": "Predictable",
              "experience": "Tab Management",
              "feature": "Re-order tabs",
            }, {
              "id": "Task 29",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to change the order of the tabs is important to me."
              ],
              "dimension": "Useful",
              "experience": "Tab Management",
              "feature": "Re-order tabs",
            }, {
              "id": "Task 30",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of changing the order of tabs in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "Tab Management",
              "feature": "Re-order tabs",
            }, {
              "id": "Task 31",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with changing the order of tabs in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Tab Management",
              "feature": "Re-order tabs",
            }, {
              "id": "Task 32",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Tab Management",
              "feature": "Re-order tabs",
            }, {
              "id": "Task 33",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Pull two tabs out from the current window and put them in the same new window as each other."
              ],
              "experience": "Tab Management",
              "feature": "Move tabs to a new window",
            }, {
              "id": "Task 34",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to move the tabs to a new window?"
              ],
              "dimension": "Accessible",
              "experience": "Tab Management",
              "feature": "Move tabs to a new window",
            }, {
              "id": "Task 35",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to move the tabs to a new window was..."
              ],
              "dimension": "Ease",
              "experience": "Tab Management",
              "feature": "Move tabs to a new window",
            }, {
              "id": "Task 36",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to move the tabs to a new window was easy."
              ],
              "dimension": "Findable",
              "experience": "Tab Management",
              "feature": "Move tabs to a new window",
            }, {
              "id": "Task 37",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once found, moving the tabs to a new window was easy to do."
              ],
              "dimension": "Usable",
              "experience": "Tab Management",
              "feature": "Move tabs to a new window",
            }, {
              "id": "Task 38",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Moving the tabs to a new window worked the way that I expected."
              ],
              "dimension": "Predictable",
              "experience": "Tab Management",
              "feature": "Move tabs to a new window",
            }, {
              "id": "Task 39",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to move tabs to a new window is important to me."
              ],
              "dimension": "Useful",
              "experience": "Tab Management",
              "feature": "Move tabs to a new window",
            }, {
              "id": "Task 40",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of moving tabs to a new window in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "Tab Management",
              "feature": "Move tabs to a new window",
            }, {
              "id": "Task 41",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with moving a group of tabs to a new window in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Tab Management",
              "feature": "Move tabs to a new window",
            }, {
              "id": "Task 42",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Tab Management",
              "feature": "Move tabs to a new window",
            }, {
              "id": "Task 43",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Close the window that has two tabs in it."
              ],
              "experience": "Tab Management",
              "feature": "Close all tabs",
            }, {
              "id": "Task 44",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully close the window?"
              ],
              "dimension": "Accessible",
              "experience": "Tab Management",
              "feature": "Close all tabs",
            }, {
              "id": "Task 45",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to close this window was..."
              ],
              "dimension": "Ease",
              "experience": "Tab Management",
              "feature": "Close all tabs",
            }, {
              "id": "Task 46",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to close a browser window was easy."
              ],
              "dimension": "Findable",
              "experience": "Tab Management",
              "feature": "Close all tabs",
            }, {
              "id": "Task 47",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once found, closing a browser window was easy to do."
              ],
              "dimension": "Usable",
              "experience": "Tab Management",
              "feature": "Close all tabs",
            }, {
              "id": "Task 48",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Closing a browser window worked the way I expected."
              ],
              "dimension": "Predictable",
              "experience": "Tab Management",
              "feature": "Close all tabs",
            }, {
              "id": "Task 49",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to close a browser window is important to me."
              ],
              "dimension": "Useful",
              "experience": "Tab Management",
              "feature": "Close all tabs",
            }, {
              "id": "Task 50",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of closing a window with multiple tabs in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "Tab Management",
              "feature": "Close all tabs",
            }, {
              "id": "Task 51",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with closing a window in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Tab Management",
              "feature": "Close all tabs",
            }, {
              "id": "Task 52",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Tab Management",
              "feature": "Close all tabs",
            }, {
              "id": "Task 53",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "In the remaining window, close only two of the tabs, so that one is still open."
              ],
              "experience": "Tab Management",
              "feature": "Close a single tab",
            }, {
              "id": "Task 54",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully close two of the tabs?"
              ],
              "dimension": "Accessible",
              "experience": "Tab Management",
              "feature": "Close a single tab",
            }, {
              "id": "Task 55",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to close two of the tabs was..."
              ],
              "dimension": "Ease",
              "experience": "Tab Management",
              "feature": "Close a single tab",
            }, {
              "id": "Task 56",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to close individual tabs was easy."
              ],
              "dimension": "Findable",
              "experience": "Tab Management",
              "feature": "Close a single tab",
            }, {
              "id": "Task 57",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once found, closing individual tabs was easy to do."
              ],
              "dimension": "Usable",
              "experience": "Tab Management",
              "feature": "Close a single tab",
            }, {
              "id": "Task 58",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Closing individual tabs worked the way I expected."
              ],
              "dimension": "Predictable",
              "experience": "Tab Management",
              "feature": "Close a single tab",
            }, {
              "id": "Task 59",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to close individual tabs is important to me."
              ],
              "dimension": "Useful",
              "experience": "Tab Management",
              "feature": "Close a single tab",
            }, {
              "id": "Task 60",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of closing individual tabs in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "Tab Management",
              "feature": "Close a single tab",
            }, {
              "id": "Task 61",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with closing individual tabs in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Tab Management",
              "feature": "Close a single tab",
            }, {
              "id": "Task 62",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Tab Management",
              "feature": "Close a single tab",
            }, {
              "id": "Task 63",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Go to a site you typically visit on the web, and add it to your Bookmarks."
              ],
              "experience": "Favorites",
              "feature": "Create a new Favorite",
            }, {
              "id": "Task 64",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully add a site to your Bookmarks?"
              ],
              "dimension": "Accessible",
              "experience": "Favorites",
              "feature": "Create a new Favorite",
            }, {
              "id": "Task 65",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to add a site to your Bookmarks was..."
              ],
              "dimension": "Ease",
              "experience": "Favorites",
              "feature": "Create a new Favorite",
            }, {
              "id": "Task 66",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to add a site to my Bookmarks was easy."
              ],
              "dimension": "Findable",
              "experience": "Favorites",
              "feature": "Create a new Favorite",
            }, {
              "id": "Task 67",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once found, adding a site to my Bookmarks was easy to do."
              ],
              "dimension": "Usable",
              "experience": "Favorites",
              "feature": "Create a new Favorite",
            }, {
              "id": "Task 68",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Adding a site to my Bookmarks worked the way that I expected."
              ],
              "dimension": "Predictable",
              "experience": "Favorites",
              "feature": "Create a new Favorite",
            }, {
              "id": "Task 69",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to add a site to my Bookmarks is important to me."
              ],
              "dimension": "Useful",
              "experience": "Favorites",
              "feature": "Create a new Favorite",
            }, {
              "id": "Task 70",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of adding sites to your Bookmarks?"
              ],
              "dimension": "Desirable",
              "experience": "Favorites",
              "feature": "Create a new Favorite",
            }, {
              "id": "Task 71",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with adding a site to your Bookmarks in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Favorites",
              "feature": "Create a new Favorite",
            }, {
              "id": "Task 72",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Favorites",
              "feature": "Create a new Favorite",
            }, {
              "id": "Task 73",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Create a new folder in your Bookmark list called \"Social Media\" and add these two sites to that folder:",
                "https://www.linkedin.com/",
                "http://www.instagram.com"
              ],
              "experience": "Favorites",
              "feature": "Adding Favorites to a folder",
            }, {
              "id": "Task 74",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully create a folder of bookmarks?"
              ],
              "dimension": "Accessible",
              "experience": "Favorites",
              "feature": "Adding Favorites to a folder",
            }, {
              "id": "Task 75",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to create a folder of bookmarks was..."
              ],
              "dimension": "Ease",
              "experience": "Favorites",
              "feature": "Adding Favorites to a folder",
            }, {
              "id": "Task 76",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to create a folder of bookmarks was easy."
              ],
              "dimension": "Findable",
              "experience": "Favorites",
              "feature": "Adding Favorites to a folder",
            }, {
              "id": "Task 77",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once found, creating a folder of bookmarks was easy to do."
              ],
              "dimension": "Usable",
              "experience": "Favorites",
              "feature": "Adding Favorites to a folder",
            }, {
              "id": "Task 78",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Creating a folder of bookmarks worked the way that I expected."
              ],
              "dimension": "Predictable",
              "experience": "Favorites",
              "feature": "Adding Favorites to a folder",
            }, {
              "id": "Task 79",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to create a folder of bookmarks is important to me."
              ],
              "dimension": "Useful",
              "experience": "Favorites",
              "feature": "Adding Favorites to a folder",
            }, {
              "id": "Task 80",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of creating a folder of bookmarks in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "Favorites",
              "feature": "Adding Favorites to a folder",
            }, {
              "id": "Task 81",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with creating a folder of bookmarks in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Favorites",
              "feature": "Adding Favorites to a folder",
            }, {
              "id": "Task 82",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Favorites",
              "feature": "Adding Favorites to a folder",
            }, {
              "id": "Task 83",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "That's it for tasks!  Click on the 'x' in the remote desktop app (near the top of your screen) to close your connection and we'll wrap up with just a few more general questions."
              ],
              "experience": null,
              "feature": null,
            }
          ],
        }, {
          "title": "groupB",
          "tasks": [
            {
              "id": "Task 1",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "1. First thing is to get connected to the remote PC.  There are a few steps:",
                "1. A website will open, asking for the project name.  Enter \"JuneBrowser\" and submit.",
                "2. A remote desktop file with a name similar to \"CUE-Browser00_...rdp\" will download.  Open or Run this file. It should launch in Remote Desktop Connection (built into Windows 10.)",
                "3. You will be prompted to accept an 'unknown connection' to the remote PC.  Don't worry, this is a one-way connection that won't affect your home PC at all. ",
                "4. When prompted to login, use this password: CUEpassword1",
                "",
                "Click 'Next' once you are connected and signed in (you will be able to see a background of a blue Windows logo.)"
              ],
              "experience": null,
              "feature": null,
            }, {
              "id": "Task 2",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Now that you are logged into the remote PC, go ahead and open up the Edge web browser."
              ],
              "experience": null,
              "feature": null,
            }, {
              "id": "Task 3",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "Which of the following words best describes your impressions about..."
              ],
              "dimension": "App Icon",
              "experience": "Appearance",
              "feature": "Impressions",
            }, {
              "id": "Task 4",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "Click the \"…\" button in the upper right hand corner.  What word best describes the appearance of this content?"
              ],
              "dimension": "Overflow Menu",
              "experience": "Appearance",
              "feature": "Impressions",
            }, {
              "id": "Task 5",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "Which of the following words best describes the design of the buttons in this browser?"
              ],
              "dimension": "Buttons",
              "experience": "Appearance",
              "feature": "Impressions",
            }, {
              "id": "Task 6",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "Which of the following words best describes the spacing and layout of this browser?"
              ],
              "dimension": "Layout",
              "experience": "Appearance",
              "feature": "Impressions",
            }, {
              "id": "Task 7",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about why you gave the answers you did."
              ],
              "dimension": "Feedback",
              "experience": "Appearance",
              "feature": "Impressions",
            }, {
              "id": "Task 8",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Open up a new tab in this browser, and use it to access a frequently visited site (for example, Twitter)."
              ],
              "experience": "New Tab Page",
              "feature": "Top sites",
            }, {
              "id": "Task 9",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully use the new tab to get to the site that you wanted?"
              ],
              "dimension": "Accessible",
              "experience": "New Tab Page",
              "feature": "Top sites",
            }, {
              "id": "Task 10",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to get to a frequently visited site from a new tab was..."
              ],
              "dimension": "Ease",
              "experience": "New Tab Page",
              "feature": "Top sites",
            }, {
              "id": "Task 11",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to get to a frequently visited site from a new tab was easy."
              ],
              "dimension": "Findable",
              "experience": "New Tab Page",
              "feature": "Top sites",
            }, {
              "id": "Task 12",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                  "Once you found how to do this, getting to a frequently visited site from a new tab was easy."
              ],
              "dimension": "Usable",
              "experience": "New Tab Page",
              "feature": "Top sites",
            }, {
              "id": "Task 13",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Getting to a frequently visited site from a new tab worked the way I expected."
              ],
              "dimension": "Predictable",
              "experience": "New Tab Page",
              "feature": "Top sites",
            }, {
              "id": "Task 14",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to get to a frequently visited site from a new tab is important to me."
              ],
              "dimension": "Useful",
              "experience": "New Tab Page",
              "feature": "Top sites",
            }, {
              "id": "Task 15",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of using a new tab to get to a frequently visited site in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "New Tab Page",
              "feature": "Top sites",
            }, {
              "id": "Task 16",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with using a new tab to get to a frequently visited site in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "New Tab Page",
              "feature": "Top sites",
            }, {
              "id": "Task 17",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "New Tab Page",
              "feature": "Top sites",
            }, {
              "id": "Task 18",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Open a new tab and use it to check the latest news about technology."
              ],
              "experience": "New Tab Page",
              "feature": "Find news",
            }, {
              "id": "Task 19",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully find the latest news about technology in a new tab?"
              ],
              "dimension": "Accessible",
              "experience": "New Tab Page",
              "feature": "Find news",
            }, {
              "id": "Task 20",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to get to the latest news about technology from a new tab was..."
              ],
              "dimension": "Ease",
              "experience": "New Tab Page",
              "feature": "Find news",
            }, {
              "id": "Task 21",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to get to the latest news about technology from a new tab was easy."
              ],
              "dimension": "Findable",
              "experience": "New Tab Page",
              "feature": "Find news",
            }, {
              "id": "Task 22",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                  "Once  you found how to do this, getting the latest news about technology from a new tab was easy to do."
              ],
              "dimension": "Usable",
              "experience": "New Tab Page",
              "feature": "Find news",
            }, {
              "id": "Task 23",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Getting the latest news about technology from a new tab worked the way I expected it to."
              ],
              "dimension": "Predictable",
              "experience": "New Tab Page",
              "feature": "Find news",
            }, {
              "id": "Task 24",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to get to the latest news about technology from a new tab is important to me."
              ],
              "dimension": "Useful",
              "experience": "New Tab Page",
              "feature": "Find news",
            }, {
              "id": "Task 25",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of finding the latest news about technology in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "New Tab Page",
              "feature": "Find news",
            }, {
              "id": "Task 26",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with finding the latest news about technology in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "New Tab Page",
              "feature": "Find news",
            }, {
              "id": "Task 27",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "New Tab Page",
              "feature": "Find news",
            }, {
              "id": "Task 28",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Open a new tab, and use it to check the weather in Shanghai."
              ],
              "experience": "Search / Navigation",
              "feature": "Check weather",
            }, {
              "id": "Task 29",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to open a new tab and check the weather in Shanghai?"
              ],
              "dimension": "Accessible",
              "experience": "Search / Navigation",
              "feature": "Check weather",
            }, {
              "id": "Task 30",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to check the weather in Shanghai was..."
              ],
              "dimension": "Ease",
              "experience": "Search / Navigation",
              "feature": "Check weather",
            }, {
              "id": "Task 31",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to check the weather in Shanghai in a new tab was easy."
              ],
              "dimension": "Findable",
              "experience": "Search / Navigation",
              "feature": "Check weather",
            }, {
              "id": "Task 32",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                  "Once you found how to do this, checking the weather in Shanghai from a new tab was easy."
              ],
              "dimension": "Usable",
              "experience": "Search / Navigation",
              "feature": "Check weather",
            }, {
              "id": "Task 33",
              "type": "question",
              "subtype": 'agreementScale',
              "description": [
                  "Checking the weather in Shanghai in a new tab worked the way I expected."
              ],
              "dimension": "Predictable",
              "experience": "Search / Navigation",
              "feature": "Check weather",
            }, {
              "id": "Task 34",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                  "Being able to check the weather in a new tab is important to me."
              ],
              "dimension": "Useful",
              "experience": "Search / Navigation",
              "feature": "Check weather",
            }, {
              "id": "Task 35",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of checking the weather in Shanghai in a new tab in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "Search / Navigation",
              "feature": "Check weather",
            }, {
              "id": "Task 36",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with checking the weather in Shanghai in a new tab in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Search / Navigation",
              "feature": "Check weather",
            }, {
              "id": "Task 37",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Search / Navigation",
              "feature": "Check weather",
            }, {
              "id": "Task 38",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Open a new tab, and search for the age of the oldest tree in the world."
              ],
              "experience": "New Tab Page",
              "feature": "New tab search",
            }, {
              "id": "Task 39",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully find the age of the oldest tree?"
              ],
              "dimension": "Accessible",
              "experience": "New Tab Page",
              "feature": "New tab search",
            }, {
              "id": "Task 40",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to search for this information was..."
              ],
              "dimension": "Ease",
              "experience": "New Tab Page",
              "feature": "New tab search",
            }, {
              "id": "Task 41",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to search the web from a new tab was easy."
              ],
              "dimension": "Findable",
              "experience": "New Tab Page",
              "feature": "New tab search",
            }, {
              "id": "Task 42",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once you found how to do this, searching the web from a new tab was easy."
              ],
              "dimension": "Usable",
              "experience": "New Tab Page",
              "feature": "New tab search",
            }, {
              "id": "Task 43",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Searching the web from a new tab worked the way I expected."
              ],
              "dimension": "Predictable",
              "experience": "New Tab Page",
              "feature": "New tab search",
            }, {
              "id": "Task 44",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to search the web from a new tab is important to me."
              ],
              "dimension": "Useful",
              "experience": "New Tab Page",
              "feature": "New tab search",
            }, {
              "id": "Task 45",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of searching the web in a new tab in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "New Tab Page",
              "feature": "New tab search",
            }, {
              "id": "Task 46",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with searching the web in a new tab in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "New Tab Page",
              "feature": "New tab search",
            }, {
              "id": "Task 47",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "New Tab Page",
              "feature": "New tab search",
            }, {
              "id": "Task 48",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "In a new tab, use the Address Bar to go directly to www.outsideonline.com"
              ],
              "experience": "Search / Navigation",
              "feature": "Enter a URL",
            }, {
              "id": "Task 49",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully go directly to the site?"
              ],
              "dimension": "Accessible",
              "experience": "Search / Navigation",
              "feature": "Enter a URL",
            }, {
              "id": "Task 50",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to get to a site using the Address Bar was..."
              ],
              "dimension": "Ease",
              "experience": "Search / Navigation",
              "feature": "Enter a URL",
            }, {
              "id": "Task 51",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to go directly to a site using the Address Bar was easy."
              ],
              "dimension": "Findable",
              "experience": "Search / Navigation",
              "feature": "Enter a URL",
            }, {
              "id": "Task 52",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once you found how to do this, going directly to a site using the Address Bar was easy."
              ],
              "dimension": "Usable",
              "experience": "Search / Navigation",
              "feature": "Enter a URL",
            }, {
              "id": "Task 53",
              "type": "question",
              "subtype": 'agreementScale',
              "description": [
                "Going directly to a site using the Address Bar worked the way I expected."
              ],
              "dimension": "Predictable",
              "experience": "Search / Navigation",
              "feature": "Enter a URL",
            }, {
              "id": "Task 54",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to go directly to a site using the Address Bar is important to me."
              ],
              "dimension": "Useful",
              "experience": "Search / Navigation",
              "feature": "Enter a URL",
            }, {
              "id": "Task 55",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of going directly to a website using the Address Bar in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "Search / Navigation",
              "feature": "Enter a URL",
            }, {
              "id": "Task 56",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with getting to a site using the Address Bar in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Search / Navigation",
              "feature": "Enter a URL",
            }, {
              "id": "Task 57",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Search / Navigation",
              "feature": "Enter a URL",
            }, {
              "id": "Task 58",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "Using the *current* tab, search for a review of the latest Honda CR-V."
              ],
              "experience": "Search / Navigation",
              "feature": "Search from current tab",
            }, {
              "id": "Task 59",
              "type": "question",
              "subtype": "yesNoMaybe",
              "description": [
                "Were you able to successfully find a review of the latest Honda CR-V?"
              ],
              "dimension": "Accessible",
              "experience": "Search / Navigation",
              "feature": "Search from current tab",
            }, {
              "id": "Task 60",
              "type": "question",
              "subtype": "timeOnTask",
              "description": [
                "The time it took to search the web from your current tab was..."
              ],
              "dimension": "Ease",
              "experience": "Search / Navigation",
              "feature": "Search from current tab",
            }, {
              "id": "Task 61",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Please rate to what extent you agree or disagree with the following statements:",
                "",
                "Finding how to search the web from an existing tab was easy."
              ],
              "dimension": "Findable",
              "experience": "Search / Navigation",
              "feature": "Search from current tab",
            }, {
              "id": "Task 62",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Once you found how to do this, searching the web from an existing tab was easy."
              ],
              "dimension": "Usable",
              "experience": "Search / Navigation",
              "feature": "Search from current tab",
            }, {
              "id": "Task 63",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Searching the web form an existing tab worked the way I expected."
              ],
              "dimension": "Predictable",
              "experience": "Search / Navigation",
              "feature": "Search from current tab",
            }, {
              "id": "Task 64",
              "type": "question",
              "subtype": "agreementScale",
              "description": [
                "Being able to search the web from an existing tab is important to me."
              ],
              "dimension": "Useful",
              "experience": "Search / Navigation",
              "feature": "Search from current tab",
            }, {
              "id": "Task 65",
              "type": "question",
              "subtype": "wordAssociation",
              "description": [
                "What word best describes your experience of searching the web from an existing tab in this browser?"
              ],
              "dimension": "Desirable",
              "experience": "Search / Navigation",
              "feature": "Search from current tab",
            }, {
              "id": "Task 66",
              "type": "question",
              "subtype": "satisfactionScale",
              "description": [
                "How satisfied are you with searching the web from an existing tab in this browser?"
              ],
              "dimension": "Satisfaction",
              "experience": "Search / Navigation",
              "feature": "Search from current tab",
            }, {
              "id": "Task 67",
              "type": "question",
              "subtype": "written",
              "description": [
                "Please share a bit about your experience with this task, and why you gave the ratings you did."
              ],
              "dimension": "Feedback",
              "experience": "Search / Navigation",
              "feature": "Search from current tab",
            }, {
              "id": "Task 68",
              "type": TaskType.instruction,
              "subtype": TaskSubtype.none,
              "description": [
                "That's it for tasks!  Click on the 'x' in the remote desktop app (near the top of your screen) to close your connection and we'll wrap up with just a few more general questions."
              ],
              "experience": null,
              "feature": null,
            }
          ]
        }
      ]
    }
  ],
  "responseMap": {
    "yesNoMaybe": {
      "byValue": {
        "1": "Yes",
        "-1": "No",
        "0": "I'm not sure."
      },
      "byResponse": {
        "Yes": 1,
        "No": -1,
        "I'm not sure.": 0
      }
    },
    "timeOnTask": {
      "byValue": {
        "1": "Much longer than I expected",
        "2": "Somewhat longer than I expected",
        "3": "About as I expected",
        "4": "Somewhat faster than I expected",
        "5": "Much faster than I expected"
      },
      "byResponse": {
        "Much longer than I expected": 1,
        "Somewhat longer than I expected": 2,
        "About as I expected": 3,
        "Somewhat faster than I expected": 4,
        "Much faster than I expected": 5
      }
    },
    "agreementScale": {
      "byValue": {
        "1": "Strongly disagree",
        "2": "Somewhat disagree",
        "3": "Neutral, neither agree or disagree",
        "4": "Somewhat agree",
        "5": "Strongly agree"
      },
      "byResponse": {
        "Strongly disagree": 1,
        "Somewhat disagree": 2,
        "Neutral, neither agree or disagree": 3,
        "Somewhat agree": 4,
        "Strongly agree": 5
      }
    },
    "wordAssociation": {
      "responses": [
        "Boring",
        "Complicated",
        "Calm",
        "Creative",
        "Cutting-edge",
        "Exciting",
        "Familiar",
        "Fresh",
        "Impressive",
        "Innovative",
        "Inspiring",
        "Intimidating",
        "Old",
        "Professional",
        "Trustworthy",
        "Unprofessional"
      ]
    },
    "satisfactionScale": {
      "byValue": {
        "1": "Very dissatisfied",
        "2": "Somewhat dissatisfied",
        "3": "Neither satisfied nor dissatisfied",
        "4": "Somewhat satisfied",
        "5": "Very satisfied"
      },
      "byResponse": {
        "Very dissatisfied": 1,
        "Somewhat dissatisfied": 2,
        "Neither satisfied nor dissatisfied": 3,
        "Somewhat satisfied": 4,
        "Very satisfied": 5
      }
    }
  }
}
