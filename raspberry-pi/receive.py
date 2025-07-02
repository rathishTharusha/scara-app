from flask import Flask, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/receive_command', methods=['POST'])
def receive():
    data = request.json
    print(f"Received: {data['color']} {data['shape']}")
    # TODO: Control SCARA bot here
    return {"status": "ok"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
