import requests
from flask import Flask, render_template, jsonify


app = Flask(__name__)

def get_random_wikipedia_article():
    url = "https://en.wikipedia.org/api/rest_v1/page/random/summary"
    try:
        response = requests.get(url).json()

        
        image_url = response.get('thumbnail', {}).get('source', None)

        
        summary = response['extract'][:500] + '...' if len(response['extract']) > 500 else response['extract']

        return {
            "title": response['title'],
            "summary": summary,
            "image_url": image_url,
            "article_url": response['content_urls']['desktop']['page']
        }
    except Exception as e:
        
        return get_random_wikipedia_article()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/random-article')
def random_article():
    article = get_random_wikipedia_article()
    return jsonify(article)

if __name__ == '__main__':
    app.run(debug=True)