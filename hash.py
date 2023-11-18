import hashlib
def calculate_sha256_hash(input_string):
    """Calculate the SHA-256 hash of a given input string."""
    sha256_hash = hashlib.sha256()
    sha256_hash.update(input_string.encode('utf-8'))
    return sha256_hash.hexdigest()