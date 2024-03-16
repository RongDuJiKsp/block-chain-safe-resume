from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/register',methods=["POST"])
def register():
    json_data = request.form
    return jsonify(json_data)

@app.route('/login',methods=["POST"])
def login():
    json_data = request.form
    return jsonify(json_data)

if __name__ == '__main__':
   app.run(host='0.0.0.0',port=5000,debug=True)