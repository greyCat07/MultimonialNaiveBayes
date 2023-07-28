const fs = require('fs');
const natural = require('natural');
const csv = require('csv-parser');

const classifier = new natural.BayesClassifier();

// Function to read the CSV file and train the classifier
function trainClassifierFromCSV(filePath) {
  const readStream = fs.createReadStream(filePath);
  readStream
    .pipe(csv())
    .on('data', (row) => {
      // Extract the email text and label from the CSV row
      const emailText = row['text']; // Use 'Email Text' as the key to access the text column
      const label = row['label']; // Use 'Email Type' as the key to access the label column

      // Add the document to the classifier's training data
      classifier.addDocument(emailText, label);
    })
    .on('end', () => {
      // Training is complete
      classifier.train();
      console.log('Classifier trained successfully!');

      classifier.save('trained_classifier.json', function(err) {
        if (err) {
          console.error('Error saving trained classifier:', err);
        } else {
          console.log('Trained classifier saved successfully as trained_classifier.json');
        }
      });
    })
    .on('error', (err) => {
      console.error('Error while reading CSV:', err);
    });
}

// Call the function with the path to your CSV file
trainClassifierFromCSV('train.csv');
