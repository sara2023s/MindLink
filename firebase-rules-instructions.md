# Firebase Security Rules Fix

The error "Missing or insufficient permissions" indicates that your Firebase security rules are preventing your application from accessing the 'links' collection.

## How to Update Firebase Security Rules

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. In the left sidebar, click on "Firestore Database"
4. Click on the "Rules" tab
5. Update your security rules to the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /links/{document=**} {
      allow read: if true;  // Temporarily allow all reads
      allow write: if request.auth != null;  // Only allow writes for authenticated users
    }
  }
}
```

6. Click "Publish" to apply these rules

## For Production Use

The rules above allow anyone to read your data, which is fine for development but not recommended for production. For production, consider rules like:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /links/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

This ensures only authenticated users can read or write data.

## More Granular Control

If you need more specific permissions (e.g., users can only modify their own data), use:

```
match /links/{linkId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == resource.data.userId;
}
```

Replace `userId` with whatever field stores the user ID in your link documents.