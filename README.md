Enrich your vocabulary with the power of spaced repetition.

This is a project using Next.js and an Express backend that communicates with MongoDB.

Basically, users can learn vocabulary lists that they upload themselves (in csv format) or pick from the existing list catalogue. After a set period of time (the default is 4 hours), they are then tested on the learned items. If the tests go well, the amount of time between increases, but once they make a mistake, it is reset to the initial 4 hours.

Depending the language they are learning, users are also tested on the gender of nouns (for German or French) or the case that is followed by a preposition (German).

Uploading learnable items will also be added to a browsable dictionary that can be edited and refined. It aims to be as complete as possible, including example sentences, images, recordings, phonetic transcription, etc. As of right now, the dictionary is not implemented yet, learning and reviewing works, although the experience is unpolished.
