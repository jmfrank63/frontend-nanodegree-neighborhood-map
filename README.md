# frontend-nanodegree-neighborhood-map

## Install the site

### Downloading

Download the zip file from: https://github.com/jmfrank63/frontend-nanodegree-neighborhood-map/archive/master.zip

Extract with uzip and change into the created directory.

With your favoirite brower open index.html

### Git

Install git

git clone https://github.com/jmfrank63/frontend-nanodegree-neighborhood-map.git

Change into the created directory.

With your favorite browser open index.html

### On the internet:

Goto Url: https://frontend-nanodegree-neighborhood-map-jmfrank63.c9.io/index.html

## Use the site

The page starts at the authors current home location in Lisbon, Portugal.

A few interesting places are shown. On the left top site the writing "Neighborhood Map"
appears. If anything goes wrong this text changes to the error message.

To search either just click on the magnifying class or enter a search term into
the search box. Only letters are supported but any substring matches. If you enter just
a single letter you get results for all terms containing this letter.

Multiple search terms are supported, to separate them use the pipe | symbol. The result
will be the union of all search terms. Double finds are singled out.

Under the preferences you can tap the Keep results checkbox. If checked subsequent searches
are added to the previous ones instead of overwriting them.

After searching you can filter your results. Filter terms work similar to search terms
with the exception that the filter will only work on the previously found searches.
Again multiple filter terms are supported by separating them with the pipe symbol.

In addition negation is supported as well. To negate a filter term prefix it with an
exclamation mark.

Under the preferences you have additional controls: Limit limits the number of searches
to a maximum number. Internally a maximum of 50 can be handled although no checking is done
in the value field.

In the radius field you enter the search radius in meters. A maxiumum of 10000 is supported,
although again the values are not checked.

To move the center of the map to your current location press the button behind locate me!
To move the center to latitude longitude coordinates enter them in the fields below locate
me!
Finally to move to an address enter it in the address box.

Next to the preferences symbol you'll find a list of all current active markers. If you click
on a list item the infobox of the corresponding marker opens. You can open the infobox by
clicking on the marker as well.

Scrolling the map around sets the center to a new location. You can take a look at its coordinates
by looking at the values in the corresponding preferences fields.

The searches are all done with calls to the foursquare api.

--------------------------------------------------------------

Comments to the instructors

Of course one could think of a lot of additional functionallity to be implemented.
Marker at the center, reverse geocoding, preference for zoom level, listing
the catagories of the searches and being able to filter for them...
I only had roughly two weeks and a 50 hour job with late shifts, so I apologize for
rough edges. The preferences menu should be styled better, and other minor issues.

I did some pagespeed optimization, but did not get past the 78/100 for mobile.
Reducing bootstrap with uncss or grunt is a little work, and time is running out.

Html and css files are w3c compatiple and have been checked.

map.js is jslint ok.

Please find the unoptimized version under index.large.html and the optimized under
index.html.
The all.js is a simple
$ cat jquery-2.1.3.js bootstrap.js knockout-3.3.0.js gmaps.js ../map.js >all.js
along with a
yui-compressor -o all.min.js all.js

Nevertheless I am quite pleased I made it in time. I hope I have met all specifcations,
but I am ready to do any adjustments required.

